function validateCaptcha(value, validator, $field) {
    var items = $('#captchaOperation').html().split(' '), sum = parseInt(items[0]) + parseInt(items[2]);
    return value === sum + '';
};

describe('callback', function() {
    beforeEach(function() {
        $([
            '<form class="form-horizontal" id="callbackForm">',
                '<div class="form-group">',
                    '<label class="col-md-3 control-label" id="captchaOperation"></label>',
                    '<div class="col-md-2">',
                        '<input type="text" class="form-control" name="captcha" />',
                    '</div>',
                '</div>',
                '<div class="form-group">',
                    '<div class="col-md-2 col-md-offset-3">',
                        '<input type="text" class="form-control" name="declarativeCaptcha" data-fv-callback data-fv-callback-callback="validateCaptcha" />',
                    '</div>',
                '</div>',
            '</form>'
        ].join('\n')).appendTo('body');

        $('#callbackForm').formValidation({
            fields: {
                captcha: {
                    validators: {
                        callback: {
                            message: 'Wrong answer',
                            callback: function(value, validator, $field) {
                                return validateCaptcha(value, validator, $field);
                            }
                        }
                    }
                }
            }
        });

        this.fv                  = $('#callbackForm').data('formValidation');
        this.$captcha            = this.fv.getFieldElements('captcha');
        this.$declarativeCaptcha = this.fv.getFieldElements('declarativeCaptcha');
    });

    afterEach(function() {
        $('#callbackForm').formValidation('destroy').remove();
    });

    it('execute the callback', function() {
        $('#captchaOperation').html('1 + 2');

        this.$captcha.val('3');
        this.fv.validate();
        expect(this.fv.isValidField('captcha')).toBeTruthy();

        this.fv.resetForm();
        this.$captcha.val('5');
        this.fv.validate();
        expect(this.fv.isValidField('captcha')).toEqual(false);
    });

    it('callback declarative', function() {
        $('#captchaOperation').html('10 + 20');

        this.$declarativeCaptcha.val('40');
        this.fv.validate();
        expect(this.fv.isValidField('declarativeCaptcha')).toEqual(false);

        this.fv.resetForm();
        this.$declarativeCaptcha.val('30');
        this.fv.validate();
        expect(this.fv.isValidField('declarativeCaptcha')).toBeTruthy();
    });
});
