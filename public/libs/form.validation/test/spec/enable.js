describe('enable validators', function() {
    beforeEach(function() {
        $([
            '<form class="form-horizontal" id="enableForm">',
                '<div class="form-group">',
                    '<input type="text" name="fullName" class="form-control" />',
                '</div>',
            '</form>'
        ].join('\n')).appendTo('body');

        $('#enableForm').formValidation({
            fields: {
                fullName: {
                    validators: {
                        notEmpty: {
                            message: 'The full name is required and cannot be empty'
                        },
                        stringLength: {
                            min: 8,
                            max: 40,
                            message: 'The full name must be more than %s and less than %s characters long'
                        },
                        regexp: {
                            enabled: false,
                            regexp: /^[a-zA-Z\s]+$/,
                            message: 'The full name can only consist of alphabetical, number, and space'
                        }
                    }
                }
            }
        });

        this.fv        = $('#enableForm').data('formValidation');
        this.$fullName = this.fv.getFieldElements('fullName');
    });

    afterEach(function() {
        $('#enableForm').formValidation('destroy').remove();
    });

    it('enable all validators', function() {
        this.$fullName.val('@ $full N@m3');
        this.fv.validate();
        expect(this.fv.isValid()).toBeTruthy();

        this.fv.resetForm();
        this.$fullName.val('Contain#$@');
        this.fv.enableFieldValidators('fullName', true);
        this.fv.validate();
        expect(this.fv.isValidField('fullName')).toEqual(false);
        expect(this.fv.isValid()).toEqual(false);
    });

    it('disable all validators', function() {
        this.fv.resetForm();
        this.fv.enableFieldValidators('fullName', false);
        this.fv.validate();
        expect(this.fv.isValid()).toBeTruthy();
    });

    it('enabled option particular validator', function() {
        this.$fullName.val('Contain@#$');
        this.fv.validate();
        expect(this.fv.isValid()).toBeTruthy();

        var messages = this.fv.getMessages('fullName');
        expect(messages.length).toEqual(0);
    });

    it('enable particular validators', function() {
        // Enable stringLength validator
        this.fv.resetForm();
        this.fv.enableFieldValidators('fullName', true, 'stringLength');
        this.fv.enableFieldValidators('fullName', true, 'regexp');
        this.$fullName.val('Full@');
        this.fv.validate();
        expect(this.fv.isValid()).toEqual(false);

        var messages = this.fv.getMessages('fullName');
        expect($.inArray('The full name must be more than 8 and less than 40 characters long', messages)).toBeGreaterThan(-1);
        expect($.inArray('The full name can only consist of alphabetical, number, and space', messages)).toBeGreaterThan(-1);
    });

    it('disable particular validators', function() {
        // Disable stringLength validator
        this.fv.enableFieldValidators('fullName', false, 'stringLength');
        this.$fullName.val('Full');
        this.fv.validate();
        expect(this.fv.isValid()).toBeTruthy();

        var messages = this.fv.getMessages('fullName');
        expect($.inArray('The full name must be more than 8 and less than 40 characters long', messages)).toEqual(-1);

        // Disable regexp validator
        this.fv.enableFieldValidators('fullName', false, 'regexp');
        this.$fullName.val('Special@#$');
        this.fv.validate();
        expect(this.fv.isValid()).toBeTruthy();

        var messages = this.fv.getMessages('fullName');
        expect($.inArray('The full name can only consist of alphabetical, number, and space', messages)).toEqual(-1);
    });
});
