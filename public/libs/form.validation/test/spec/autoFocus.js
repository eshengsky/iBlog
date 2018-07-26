describe('autoFocus', function() {
    // Use $element.is(document.activeElement) instead of $element.is(':focus')
    // to support running the test cases with PhantomJS
    // See https://github.com/ariya/phantomjs/issues/10427

    beforeEach(function() {
        $([
            '<form class="form-horizontal" id="autoFocusForm">',
                '<div class="form-group">',
                    '<input type="text" name="username" required />',
                '</div>',
                '<div class="form-group">',
                    '<input type="text" name="email" required data-fv-emailaddress />',
                '</div>',
                '<div class="form-group">',
                    '<button type="submit" id="submitButton">Submit</button>',
                '</div>',
            '</form>'
        ].join('')).appendTo('body');

        this.fv        = $('#autoFocusForm')
                            .formValidation()
                            .submit(function(e) {
                                e.preventDefault();
                            })
                            .data('formValidation');
        this.$username = this.fv.getFieldElements('username');
        this.$email    = this.fv.getFieldElements('email');
    });

    afterEach(function() {
        $('#autoFocusForm').formValidation('destroy').remove();
    });

    it('default option (autoFocus=true)', function() {
        $('#submitButton').click();
        expect(this.$username.is(document.activeElement)).toBeTruthy();
        expect($(document.activeElement).attr('name')).toEqual('username');

        this.fv.resetForm();
        this.$username.val('user_name');
        this.$email.val('');
        $('#submitButton').click();
        expect(this.$email.is(document.activeElement)).toBeTruthy();
        expect($(document.activeElement).attr('name')).toEqual('email');
    });

    it('set autoFocus=false for form', function() {
        $('#autoFocusForm')
                .formValidation('destroy')
                .formValidation({
                    autoFocus: false
                });
        this.$username.val('');
        this.$email.val('invalid#email');
        $('#submitButton').click();

        expect(this.$username.is(document.activeElement)).toBeFalsy();
        expect(this.$email.is(document.activeElement)).toBeFalsy();
    });

    it('set autoFocus=false for all fields', function() {
        this.fv
            .addField('username', {
                autoFocus: false
            })
            .addField('email', {
                autoFocus: false
            });
        this.$username.val('user_name');
        this.$email.val('invalid#email');
        $('#submitButton').click();

        expect(this.$username.is(document.activeElement)).toBeFalsy();
        expect(this.$email.is(document.activeElement)).toBeFalsy();
    });

    it('set different autoFocus value for fields', function() {
        this.fv
            .addField('username', {
                autoFocus: false
            })
            .addField('email', {
                autoFocus: true
            });
        this.$username.val('');
        this.$email.val('invalid_email');
        $('#submitButton').click();

        expect(this.$username.is(document.activeElement)).toBeFalsy();
        expect(this.$email.is(document.activeElement)).toBeTruthy();
        expect($(document.activeElement).attr('name')).toEqual('email');
    });
});
