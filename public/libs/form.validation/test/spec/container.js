describe('container form option', function() {
    beforeEach(function() {
        $([
            '<form id="containerForm" class="form-horizontal">',
                '<div class="form-group">',
                    '<label class="col-lg-3 control-label">Full name</label>',
                    '<div class="col-lg-4">',
                        '<input type="text" class="form-control" name="firstName" required placeholder="First name" data-fv-notempty-message="The first name is required" />',
                    '</div>',
                    '<div class="col-lg-4">',
                        '<input type="text" class="form-control" name="lastName" required placeholder="Last name" data-fv-notempty-message="The last name is required" />',
                    '</div>',
                '</div>',
                '<div id="errors"></div>',
            '</form>'
        ].join('')).appendTo('body');
    });

    afterEach(function() {
        $('#containerForm').formValidation('destroy').remove();
    });

    it('form container declarative', function() {
        $('#containerForm')
            .attr('data-fv-container', '#errors')
            .formValidation();

        this.fv         = $('#containerForm').data('formValidation');
        this.$firstName = this.fv.getFieldElements('firstName');
        this.$lastName  = this.fv.getFieldElements('lastName');

        expect($('#errors').find('.help-block').length).toBeGreaterThan(0);

        this.$firstName.val('First');
        this.$lastName.val('');
        this.fv.validate();
        expect($('#errors').find('.help-block:visible[data-fv-for="firstName"]').length).toEqual(0);
        expect($('#errors').find('.help-block:visible[data-fv-for="lastName"]').length).toBeGreaterThan(0);
    });

    it('form container programmatically', function() {
        $('#containerForm').formValidation({
            err: {
                container: '#errors'
            }
        });

        this.fv         = $('#containerForm').data('formValidation');
        this.$firstName = this.fv.getFieldElements('firstName');
        this.$lastName  = this.fv.getFieldElements('lastName');

        expect($('#errors').find('.help-block').length).toBeGreaterThan(0);

        this.$firstName.val('');
        this.$lastName.val('Last');
        this.fv.validate();
        expect($('#errors').find('.help-block:visible[data-fv-for="firstName"]').length).toBeGreaterThan(0);
        expect($('#errors').find('.help-block:visible[data-fv-for="lastName"]').length).toEqual(0);

        this.fv.resetForm();
        this.$firstName.val('First');
        this.$lastName.val('Last');
        this.fv.validate();
        expect($('#errors').find('.help-block:visible').length).toEqual(0);
    });
});

describe('container field option', function() {
    beforeEach(function() {
        $([
            '<form id="containerForm" class="form-horizontal">',
                '<div class="form-group">',
                    '<label class="col-lg-3 control-label">Full name</label>',
                    '<div class="col-lg-4">',
                        '<input type="text" class="form-control" name="firstName" required placeholder="First name" data-fv-notempty-message="The first name is required" data-fv-container="#firstNameMessage" />',
                        '<span class="help-block" id="firstNameMessage" />',
                    '</div>',
                    '<div class="col-lg-4">',
                        '<input type="text" class="form-control" name="lastName" required placeholder="Last name" data-fv-notempty-message="The last name is required" />',
                        '<span class="help-block lastNameMessage" />',
                    '</div>',
                '</div>',
            '</form>'
        ].join('')).appendTo('body');

        $('#containerForm').formValidation({
            fields: {
                lastName: {
                    err: '.lastNameMessage'
                }
            }
        });

        this.fv         = $('#containerForm').data('formValidation');
        this.$firstName = this.fv.getFieldElements('firstName');
        this.$lastName  = this.fv.getFieldElements('lastName');
    });

    afterEach(function() {
        $('#containerForm').formValidation('destroy').remove();
    });

    it('field container declarative', function() {
        expect($.trim($('#firstNameMessage').text())).toEqual('The first name is required');
        expect($.trim($('.lastNameMessage').text())).toEqual('The last name is required');
    });

    it('field container programmatically', function() {
        this.$firstName.val('First');
        this.$lastName.val('');
        this.fv.validate();
        expect($('#firstNameMessage').find('.help-block:visible').length).toEqual(0);
        expect($('.lastNameMessage').find('.help-block:visible').length).toBeGreaterThan(0);

        this.fv.resetForm();
        this.$firstName.val('');
        this.$lastName.val('Last');
        this.fv.validate();
        expect($('#firstNameMessage').find('.help-block:visible').length).toBeGreaterThan(0);
        expect($('.lastNameMessage').find('.help-block:visible').length).toEqual(0);
    });
});

describe('container tooltip/popover', function() {
    beforeEach(function() {
        $([
            '<form id="containerForm" class="form-horizontal">',
                '<div class="form-group">',
                    '<label class="col-lg-3 control-label">Full name</label>',
                    '<div class="col-lg-4">',
                        '<input type="text" class="form-control" name="firstName" required placeholder="First name" data-fv-notempty-message="The first name is required" />',
                    '</div>',
                    '<div class="col-lg-4">',
                        '<input type="text" class="form-control" name="lastName" required placeholder="Last name" data-fv-notempty-message="The last name is required" />',
                    '</div>',
                '</div>',
                '<div id="errors"></div>',
            '</form>'
        ].join('')).appendTo('body');
    });

    afterEach(function() {
        $('#containerForm').formValidation('destroy').remove();
    });

    it('container declarative', function() {
        $('#containerForm')
            .attr('data-fv-container', 'tooltip')
            .find('[name="lastName"]')
                .attr('data-fv-container', 'popover')
                .end()
            .formValidation({
                icon: {
                    valid: 'glyphicon glyphicon-ok',
                    invalid: 'glyphicon glyphicon-remove',
                    validating: 'glyphicon glyphicon-refresh'
                }
            });

        this.fv         = $('#containerForm').data('formValidation');
        this.$firstName = this.fv.getFieldElements('firstName');
        this.$lastName  = this.fv.getFieldElements('lastName');

        this.fv.validate();
        expect(this.$firstName.parent().find('i').data('bs.tooltip')).toBeDefined();
        expect(this.$firstName.parent().find('i').data('bs.tooltip').type).toEqual('tooltip');
        expect(this.$lastName.parent().find('i').data('bs.popover')).toBeDefined();
        expect(this.$lastName.parent().find('i').data('bs.popover').type).toEqual('popover');

        this.fv.resetForm();
        this.$firstName.val('First');
        this.$lastName.val('Last');
        this.fv.validate();
        expect(this.$firstName.parent().find('i').data('bs.tooltip')).toBeUndefined();
        expect(this.$lastName.parent().find('i').data('bs.popover')).toBeUndefined();
    });

    it('container programmatically', function() {
        $('#containerForm').formValidation({
            icon: {
                valid: 'glyphicon glyphicon-ok',
                invalid: 'glyphicon glyphicon-remove',
                validating: 'glyphicon glyphicon-refresh'
            },
            err: {
                container: 'tooltip'
            },
            fields: {
                lastName: {
                    err: 'popover'
                }
            }
        });

        this.fv         = $('#containerForm').data('formValidation');
        this.$firstName = this.fv.getFieldElements('firstName');
        this.$lastName  = this.fv.getFieldElements('lastName');

        this.fv.validate();
        expect(this.$firstName.parent().find('i').data('bs.tooltip')).toBeDefined();
        expect(this.$firstName.parent().find('i').data('bs.tooltip').type).toEqual('tooltip');
        expect(this.$lastName.parent().find('i').data('bs.popover')).toBeDefined();
        expect(this.$lastName.parent().find('i').data('bs.popover').type).toEqual('popover');

        this.fv.resetForm();
        this.$firstName.val('First');
        this.$lastName.val('Last');
        this.fv.validate();
        expect(this.$firstName.parent().find('i').data('bs.tooltip')).toBeUndefined();
        expect(this.$lastName.parent().find('i').data('bs.popover')).toBeUndefined();
    });

    // #991: Validate once when setting trigger: blur, container: tooltip
    it('trigger: blur, container: tooltip', function() {
        $('#containerForm').formValidation({
            icon: {
                valid: 'glyphicon glyphicon-ok',
                invalid: 'glyphicon glyphicon-remove',
                validating: 'glyphicon glyphicon-refresh'
            },
            err: {
                container: 'tooltip'
            },
            trigger: 'blur',
            fields: {
                firstName: {
                    validators: {
                        stringLength: {
                            min: 5,
                            message: 'The first name must be more than 5 characters'
                        },
                        notEmpty: {
                            message: 'The first name is required'
                        },
                        regexp: {
                            regexp: /^[a-z]+$/i,
                            message: 'The first name must consist of a-z, A-Z characters only'
                        }
                    }
                },
                lastName: {
                    validators: {
                        stringLength: {
                            min: 5,
                            message: 'The last name must be more than 5 characters'
                        },
                        notEmpty: {
                            message: 'The last name is required'
                        },
                        regexp: {
                            regexp: /^[a-z]+$/i,
                            message: 'The last name must consist of a-z, A-Z characters only'
                        }
                    }
                }
            }
        });

        this.fv         = $('#containerForm').data('formValidation');
        this.$firstName = this.fv.getFieldElements('firstName');
        this.$lastName  = this.fv.getFieldElements('lastName');

        this.$firstName.val('').trigger('blur');
        this.fv.validate();
        expect(this.$firstName.parent().find('i').data('bs.tooltip')).toBeDefined();
        expect(this.$firstName.parent().find('i').data('bs.tooltip').type).toEqual('tooltip');
        expect(this.$firstName.parent().find('i').data('bs.tooltip').getTitle()).toEqual('The first name is required');

        this.fv.resetForm();
        this.$firstName.val('@not#valid');
        this.$lastName.val('').focus();
        this.fv.validate();
        expect(this.$firstName.parent().find('i').data('bs.tooltip')).toBeDefined();
        expect(this.$firstName.parent().find('i').data('bs.tooltip').type).toEqual('tooltip');
        expect(this.$firstName.parent().find('i').data('bs.tooltip').getTitle()).toEqual('The first name must consist of a-z, A-Z characters only');

        this.fv.resetForm();
        this.$firstName.val('Phuo');
        this.$lastName.val('').focus();
        this.fv.validate();
        expect(this.$firstName.parent().find('i').data('bs.tooltip')).toBeDefined();
        expect(this.$firstName.parent().find('i').data('bs.tooltip').type).toEqual('tooltip');
        expect(this.$firstName.parent().find('i').data('bs.tooltip').getTitle()).toEqual('The first name must be more than 5 characters');

        this.fv.resetForm();
        this.$firstName.val('Phuoc');
        this.$lastName.val('').focus();
        this.fv.validate();
        expect(this.$firstName.parent().find('i').data('bs.tooltip')).toBeUndefined();
    });
});
