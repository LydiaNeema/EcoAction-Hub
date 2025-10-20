from marshmallow import Schema, fields, validate

class EmergencyAlertSchema(Schema):
    id = fields.Int(dump_only=True)
    type = fields.Str(required=True, validate=validate.Length(min=1, max=100))
    location = fields.Str(required=True, validate=validate.Length(min=1, max=200))
    severity = fields.Str(required=True, validate=validate.OneOf(['Low', 'Medium', 'High', 'Critical']))
    description = fields.Str()
    recommendation = fields.Str()
    affected_areas = fields.Str()
    county = fields.Str()
    is_active = fields.Bool()
    created_at = fields.DateTime(dump_only=True)
    updated_at = fields.DateTime(dump_only=True)
    expires_at = fields.DateTime()

class EmergencyReportSchema(Schema):
    id = fields.Int(dump_only=True)
    reporter_name = fields.Str(validate=validate.Length(max=100))
    reporter_phone = fields.Str(validate=validate.Length(max=20))
    reporter_email = fields.Email()
    emergency_type = fields.Str(required=True, validate=validate.Length(min=1, max=100))
    location = fields.Str(required=True, validate=validate.Length(min=1, max=200))
    description = fields.Str(required=True, validate=validate.Length(min=1))
    severity = fields.Str(validate=validate.OneOf(['Low', 'Medium', 'High', 'Critical']))
    status = fields.Str()
    created_at = fields.DateTime(dump_only=True)
    updated_at = fields.DateTime(dump_only=True)

class EmergencyContactSchema(Schema):
    id = fields.Int(dump_only=True)
    service = fields.Str(required=True, validate=validate.Length(min=1, max=100))
    type = fields.Str(required=True, validate=validate.Length(min=1, max=100))
    number = fields.Str(required=True, validate=validate.Length(min=1, max=50))
    county = fields.Str()
    location = fields.Str()
    is_active = fields.Bool()
    created_at = fields.DateTime(dump_only=True)

# Schema instances
emergency_alert_schema = EmergencyAlertSchema()
emergency_alerts_schema = EmergencyAlertSchema(many=True)

emergency_report_schema = EmergencyReportSchema()
emergency_reports_schema = EmergencyReportSchema(many=True)

emergency_contact_schema = EmergencyContactSchema()
emergency_contacts_schema = EmergencyContactSchema(many=True)
