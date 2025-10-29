import os
import uuid
from flask import Blueprint, request, jsonify, current_app
from flask_jwt_extended import jwt_required, get_jwt_identity
from werkzeug.utils import secure_filename
from PIL import Image
import io

bp = Blueprint('upload', __name__, url_prefix='/api/upload')

# Allowed file extensions
ALLOWED_EXTENSIONS = {'png', 'jpg', 'jpeg', 'gif', 'webp'}
MAX_FILE_SIZE = 5 * 1024 * 1024  # 5MB

def allowed_file(filename):
    """Check if file has allowed extension"""
    return '.' in filename and \
           filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS

def compress_image(image_file, max_size=(800, 600), quality=85):
    """Compress and resize image"""
    try:
        # Open image
        img = Image.open(image_file)
        
        # Convert RGBA to RGB if necessary
        if img.mode in ('RGBA', 'LA'):
            background = Image.new('RGB', img.size, (255, 255, 255))
            background.paste(img, mask=img.split()[-1] if img.mode == 'RGBA' else None)
            img = background
        
        # Resize if larger than max_size
        img.thumbnail(max_size, Image.Resampling.LANCZOS)
        
        # Save compressed image to bytes
        output = io.BytesIO()
        img.save(output, format='JPEG', quality=quality, optimize=True)
        output.seek(0)
        
        return output
    except Exception as e:
        raise Exception(f"Failed to process image: {str(e)}")

@bp.route('/image', methods=['POST'])
@jwt_required()
def upload_image():
    """Upload and process an image file"""
    try:
        current_user_id = get_jwt_identity()
        
        # Check if file was uploaded
        if 'image' not in request.files:
            return jsonify({
                'success': False,
                'error': 'No image file provided'
            }), 400
        
        file = request.files['image']
        
        # Check if file was selected
        if file.filename == '':
            return jsonify({
                'success': False,
                'error': 'No file selected'
            }), 400
        
        # Check file size
        file.seek(0, os.SEEK_END)
        file_size = file.tell()
        file.seek(0)
        
        if file_size > MAX_FILE_SIZE:
            return jsonify({
                'success': False,
                'error': f'File size too large. Maximum size is {MAX_FILE_SIZE // (1024*1024)}MB'
            }), 400
        
        # Check file extension
        if not allowed_file(file.filename):
            return jsonify({
                'success': False,
                'error': 'Invalid file type. Allowed types: ' + ', '.join(ALLOWED_EXTENSIONS)
            }), 400
        
        # Generate unique filename
        file_extension = file.filename.rsplit('.', 1)[1].lower()
        unique_filename = f"{uuid.uuid4().hex}_{current_user_id}.jpg"  # Always save as JPG after compression
        
        # Create upload directory if it doesn't exist
        upload_dir = os.path.join(current_app.instance_path, 'uploads', 'images')
        os.makedirs(upload_dir, exist_ok=True)
        
        file_path = os.path.join(upload_dir, unique_filename)
        
        try:
            # Compress and save image
            compressed_image = compress_image(file)
            with open(file_path, 'wb') as f:
                f.write(compressed_image.read())
            
            # Generate URL for the uploaded image
            # In production, this would be a CDN URL or proper file serving endpoint
            image_url = f"/uploads/images/{unique_filename}"
            
            return jsonify({
                'success': True,
                'message': 'Image uploaded successfully',
                'image_url': image_url,
                'filename': unique_filename
            }), 201
            
        except Exception as e:
            # Clean up file if processing failed
            if os.path.exists(file_path):
                os.remove(file_path)
            raise e
        
    except Exception as e:
        return jsonify({
            'success': False,
            'error': f'Upload failed: {str(e)}'
        }), 500

@bp.route('/images/<filename>', methods=['GET'])
def serve_image(filename):
    """Serve uploaded images"""
    try:
        upload_dir = os.path.join(current_app.instance_path, 'uploads', 'images')
        file_path = os.path.join(upload_dir, secure_filename(filename))
        
        if not os.path.exists(file_path):
            return jsonify({
                'success': False,
                'error': 'Image not found'
            }), 404
        
        from flask import send_file
        return send_file(file_path)
        
    except Exception as e:
        return jsonify({
            'success': False,
            'error': str(e)
        }), 500

@bp.route('/images/<filename>', methods=['DELETE'])
@jwt_required()
def delete_image(filename):
    """Delete an uploaded image"""
    try:
        current_user_id = get_jwt_identity()
        
        # Extract user ID from filename for basic security check
        if f"_{current_user_id}." not in filename:
            return jsonify({
                'success': False,
                'error': 'Unauthorized to delete this image'
            }), 403
        
        upload_dir = os.path.join(current_app.instance_path, 'uploads', 'images')
        file_path = os.path.join(upload_dir, secure_filename(filename))
        
        if os.path.exists(file_path):
            os.remove(file_path)
            
        return jsonify({
            'success': True,
            'message': 'Image deleted successfully'
        }), 200
        
    except Exception as e:
        return jsonify({
            'success': False,
            'error': str(e)
        }), 500
