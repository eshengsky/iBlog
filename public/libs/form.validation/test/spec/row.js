describe('row option', function() {
    beforeEach(function() {
        $([
            '<form id="groupForm" method="post" class="form-horizontal">',
                '<div class="form-group">',
                    '<div class="firstNameGroup">',
                        '<label class="col-sm-2 control-label">First name</label>',
                        '<div class="col-sm-4">',
                            '<input type="text" class="form-control" name="firstName" />',
                        '</div>',
                    '</div>',
                    '<div class="lastNameGroup">',
                        '<label class="col-sm-2 control-label">Last name</label>',
                        '<div class="col-sm-4">',
                            '<input type="text" class="form-control" name="lastName" data-fv-row=".lastNameGroup" />',
                        '</div>',
                    '</div>',
                '</div>',

                '<div class="form-group">',
                    '<label class="col-sm-2 control-label">Username</label>',
                    '<div class="col-sm-5">',
                        '<input type="text" class="form-control" name="username" />',
                    '</div>',
                '</div>',
            '</form>'
        ].join('')).appendTo('body');

        $('#groupForm').formValidation({
            fields: {
                firstName: {
                    row: '.firstNameGroup',
                    validators: {
                        notEmpty: {
                            message: 'The first name is required and cannot be empty'
                        }
                    }
                },
                lastName: {
                    validators: {
                        notEmpty: {
                            message: 'The last name is required and cannot be empty'
                        }
                    }
                },
                username: {
                    validators: {
                        notEmpty: {
                            message: 'The username is required and cannot be empty'
                        },
                        stringLength: {
                            min: 6,
                            max: 30,
                            message: 'The username must be more than 6 and less than 30 characters long'
                        },
                        regexp: {
                            regexp: /^[a-zA-Z0-9_\.]+$/,
                            message: 'The username can only consist of alphabetical, number, dot and underscore'
                        }
                    }
                }
            }
        });

        this.fv         = $('#groupForm').data('formValidation');
        this.$firstName = this.fv.getFieldElements('firstName');
        this.$lastName  = this.fv.getFieldElements('lastName');
        this.$username  = this.fv.getFieldElements('username');
    });

    afterEach(function() {
        $('#groupForm').formValidation('destroy').remove();
    });

    it('default', function() {
        this.$username.val('123@#$');
        this.fv.validate();
        expect(this.$username.parents('.form-group').hasClass('has-error')).toBeTruthy();
        expect(this.$username.parents('.form-group').hasClass('has-success')).toEqual(false);

        this.fv.resetForm();
        this.$username.val('validUser.Name');
        this.fv.validate();
        expect(this.$username.parents('.form-group').hasClass('has-success')).toBeTruthy();
        expect(this.$username.parents('.form-group').hasClass('has-error')).toEqual(false);
    });

    it('programmatically usage', function() {
        this.$firstName.val('');
        this.fv.validate();
        expect(this.$firstName.parents('.firstNameGroup').hasClass('has-error')).toBeTruthy();
        expect(this.$firstName.parents('.firstNameGroup').hasClass('has-success')).toEqual(false);
        expect(this.$firstName.parents('.form-group').hasClass('has-error')).toEqual(false);
    });

    it('declarative usage', function() {
        this.$firstName.val('First');
        this.$lastName.val('Last');
        this.fv.validate();
        expect(this.$lastName.parents('.lastNameGroup').hasClass('has-success')).toBeTruthy();
        expect(this.$lastName.parents('.lastNameGroup').hasClass('has-error')).toEqual(false);
        expect(this.$lastName.parents('.form-group').hasClass('has-success')).toEqual(false);
        expect(this.$lastName.parents('.form-group').hasClass('has-error')).toEqual(false);
    });
});
