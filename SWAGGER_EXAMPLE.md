# How to Add Swagger Documentation to Endpoints

## Example: Community Actions GET Endpoint

Add this docstring to your endpoint function in `server/app/routes/community.py`:

```python
@bp.route('/actions', methods=['GET'])
def get_actions():
    """
    Get all community actions
    ---
    tags:
      - Community Actions
    parameters:
      - name: status
        in: query
        type: string
        required: false
        description: Filter by status (active, completed)
        enum: [active, completed]
    responses:
      200:
        description: List of community actions
        schema:
          type: object
          properties:
            success:
              type: boolean
              example: true
            data:
              type: array
              items:
                type: object
                properties:
                  id:
                    type: integer
                    example: 1
                  title:
                    type: string
                    example: "Beach Cleanup Drive"
                  description:
                    type: string
                    example: "Join us for a coastal cleanup"
                  category:
                    type: string
                    example: "Environment"
                  location:
                    type: string
                    example: "Diani Beach, Mombasa"
                  date:
                    type: string
                    format: date-time
                    example: "2024-11-15T09:00:00"
                  participants_count:
                    type: integer
                    example: 25
                  status:
                    type: string
                    example: "active"
      500:
        description: Server error
        schema:
          type: object
          properties:
            success:
              type: boolean
              example: false
            error:
              type: string
              example: "Failed to fetch actions"
    """
    # ... existing code ...
```

## Example: Create Action (with JWT Auth)

```python
@bp.route('/actions', methods=['POST'])
@jwt_required()
def create_action():
    """
    Create a new community action
    ---
    tags:
      - Community Actions
    security:
      - Bearer: []
    parameters:
      - name: body
        in: body
        required: true
        schema:
          type: object
          required:
            - title
            - description
            - category
            - location
            - date
          properties:
            title:
              type: string
              example: "Tree Planting Campaign"
            description:
              type: string
              example: "Plant 1000 trees in Karura Forest"
            category:
              type: string
              example: "Environment"
            location:
              type: string
              example: "Karura Forest, Nairobi"
            date:
              type: string
              format: date-time
              example: "2024-12-01T08:00:00"
            image:
              type: string
              example: "https://example.com/image.jpg"
    responses:
      201:
        description: Action created successfully
        schema:
          type: object
          properties:
            success:
              type: boolean
              example: true
            message:
              type: string
              example: "Action created successfully"
            data:
              type: object
      401:
        description: Unauthorized
      400:
        description: Validation error
    """
    # ... existing code ...
```

## Quick Tips

1. **Always add the `---` separator** after the docstring text
2. **Use tags** to group related endpoints
3. **Add security** for protected endpoints
4. **Include examples** for better understanding
5. **Document all parameters** and responses

## Access Swagger UI

After deploying:
- Local: http://localhost:5000/api/docs
- Production: https://ecoaction-hub.onrender.com/api/docs
