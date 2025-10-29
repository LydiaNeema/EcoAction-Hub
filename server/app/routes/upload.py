from flask import Blueprint, request, jsonify, current_app, send_from_directory
from flask_jwt_extended import jwt_required
import os
import uuid
from werkzeug.utils import secure_filename
from PIL import Image
import io

bp = Blueprint('upload', __name__, url_prefix='/api/upload')

# Allowed file extensions
ALLOWED_EXTENSIONS = {'png', 'jpg', 'jpeg', 'gif', 'webp'}
MAX_FILE_SIZE = 5 * 1024 * 1024  # 5MB

def allowed_file(filename):
    return '.' in filename and \
           filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS

def compress_image(image_data, max_size=(800, 600), quality=85):
    """Compress and resize image"""
    try:
        img = Image.open(io.BytesIO(image_data))
        
        # Convert to RGB if necessary
        if img.mode in ('RGBA', 'LA', 'P'):
            img = img.convert('RGB')
        
        # Resize if too large
        img.thumbnail(max_size, Image.Resampling.LANCZOS)
        
        # Save compressed image
        output = io.BytesIO()
        img.save(output, format='JPEG', quality=quality, optimize=True)
        output.seek(0)
        
        return output.getvalue()
    except Exception as e:
        raise Exception(f"Image processing failed: {str(e)}")

@bp.route('/image', methods=['POST'])
@jwt_required()
def upload_image():
    """Upload and process an image file"""
    try:
        # Check if file is present
        if 'file' not in request.files:
            return jsonify({
                'success': False,
                'error': 'No file provided'
            }), 400
        
        file = request.files['file']
        
        # Check if file is selected
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
                'error': f'File too large. Maximum size is {MAX_FILE_SIZE // (1024*1024)}MB'
            }), 400
        
        # Check file type
        if not allowed_file(file.filename):
            return jsonify({
                'success': False,
                'error': 'Invalid file type. Allowed: PNG, JPG, JPEG, GIF, WEBP'
            }), 400
        
        # Generate unique filename
        file_extension = secure_filename(file.filename).rsplit('.', 1)[1].lower()
        unique_filename = f"{uuid.uuid4().hex}.{file_extension}"
        
        # Create uploads directory if it doesn't exist
        upload_dir = os.path.join(current_app.root_path, '..', '..', 'client', 'public', 'uploads')
        os.makedirs(upload_dir, exist_ok=True)
        
        # Read and compress image
        image_data = file.read()
        compressed_data = compress_image(image_data)
        
        # Save compressed image
        file_path = os.path.join(upload_dir, unique_filename)
        with open(file_path, 'wb') as f:
            f.write(compressed_data)
        
        # Return the public URL
        image_url = f"/uploads/{unique_filename}"
        
        return jsonify({
            'success': True,
            'message': 'Image uploaded successfully',
            'image_url': image_url,
            'filename': unique_filename
        }), 200
        
    except Exception as e:
        return jsonify({
            'success': False,
            'error': f'Upload failed: {str(e)}'
        }), 500

@bp.route('/image/<filename>', methods=['DELETE'])
@jwt_required()
def delete_image(filename):
    """Delete an uploaded image"""
    try:
        # Validate filename
        if not filename or '..' in filename:
            return jsonify({
                'success': False,
                'error': 'Invalid filename'
            }), 400
        
        # Construct file path
        upload_dir = os.path.join(current_app.root_path, '..', '..', 'client', 'public', 'uploads')
        file_path = os.path.join(upload_dir, secure_filename(filename))
        
        # Check if file exists and delete
        if os.path.exists(file_path):
            os.remove(file_path)
            return jsonify({
                'success': True,
                'message': 'Image deleted successfully'
            }), 200
        else:
            return jsonify({
                'success': False,
                'error': 'File not found'
            }), 404
            
    except Exception as e:
        return jsonify({
            'success': False,
            'error': f'Delete failed: {str(e)}'
        }), 500

@bp.route('/serve/<filename>')
def serve_image(filename):
    """Serve uploaded images"""
    try:
        # Validate filename
        if not filename or '..' in filename:
            return jsonify({
                'success': False,
                'error': 'Invalid filename'
            }), 400
        
        # Construct upload directory path
        upload_dir = os.path.join(current_app.root_path, '..', '..', 'client', 'public', 'uploads')
        
        # Check if file exists
        file_path = os.path.join(upload_dir, secure_filename(filename))
        if not os.path.exists(file_path):
            return jsonify({
                'success': False,
                'error': 'File not found'
            }), 404
        
        return send_from_directory(upload_dir, secure_filename(filename))
        
    except Exception as e:
        return jsonify({
            'success': False,
            'error': f'Serve failed: {str(e)}'
        }), 500
