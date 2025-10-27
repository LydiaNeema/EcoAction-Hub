from marshmallow import Schema, fields, validate


class RegisterSchema(Schema):
    email = fields.Email(required=True)
    password = fields.Str(required=True, validate=validate.Length(min=6, max=128))
    full_name = fields.Str(validate=validate.Length(max=120))


class LoginSchema(Schema):
    email = fields.Email(required=True)
    password = fields.Str(required=True)


class UserSchema(Schema):
    id = fields.Int(dump_only=True)
    email = fields.Email()
    created_at = fields.DateTime()
    updated_at = fields.DateTime()


register_schema = RegisterSchema()
login_schema = LoginSchema()
user_schema = UserSchema()

