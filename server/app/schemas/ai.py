from marshmallow import Schema, fields, validate


class ChatRequestSchema(Schema):
    message = fields.Str(required=True, validate=validate.Length(min=1))


class ChatResponseSchema(Schema):
    reply = fields.Str(required=True)


chat_request_schema = ChatRequestSchema()
chat_response_schema = ChatResponseSchema()

