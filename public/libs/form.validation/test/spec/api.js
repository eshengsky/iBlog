describe('api', function() {
    beforeEach(function() {
        $([
            '<form class="form-horizontal" id="apiForm">',
                '<div class="form-group">',
                    '<input type="text" name="username" data-fv-notempty data-fv-stringlength data-fv-stringlength-min="8" />',
                '</div>',
                '<div class="form-group">',
                    '<input type="text" name="email" data-fv-notempty data-fv-emailaddress />',
                '</div>',
                '<div class="form-group">',
                    '<input type="text" name="note"/>',
                '</div>',
            '</form>'
        ].join('\n')).appendTo('body');

        $('#apiForm').formValidation({
            icon: {
                valid: 'glyphicon glyphicon-ok',
                invalid: 'glyphicon glyphicon-remove',
                validating: 'glyphicon glyphicon-refresh'
            }
        });

        this.fv     = $('#apiForm').data('formValidation');
        this.$email = this.fv.getFieldElements('email');
        this.$note  = $('#apiForm').find('input[name="note"]');
    });

    afterEach(function() {
        $('#apiForm').formValidation('destroy').remove();
    });

    it('revalidateField()', function() {
        this.$email.val('email@domain.com');
        this.fv.validate();
        expect(this.fv.isValidField('email')).toBeTruthy();

        this.$email.val('invalid#email.address');
        this.fv.revalidateField('email');
        expect(this.fv.isValidField(this.$email)).toEqual(false);
    });

    it('destroy()', function() {
        this.fv.destroy();
        expect($('#apiForm').data('formValidation')).toBeUndefined();
        expect($('#apiForm').find('i[data-fv-icon-for]').length).toEqual(0);
        expect($('#apiForm').find('.help-block[data-fv-for]').length).toEqual(0);
        expect($('#apiForm').find('.has-feedback').length).toEqual(0);
        expect($('#apiForm').find('.has-success').length).toEqual(0);
        expect($('#apiForm').find('.has-error').length).toEqual(0);
        expect($('#apiForm').find('[data-fv-field]').length).toEqual(0);
    });

    it('getOptions()', function() {
        // Form options
        expect(this.fv.getOptions().icon.valid).toEqual('glyphicon glyphicon-ok');

        // Field options
        expect(this.fv.getOptions('username', 'stringlength')).toBeNull();
        expect(this.fv.getOptions('username', 'stringlength', 'min')).toBeNull();

        expect(this.fv.getOptions('username', 'stringLength')).toBeDefined();
        expect(this.fv.getOptions('username', 'stringLength', 'min')).toEqual('8');
        expect(this.fv.getOptions('username', 'stringlength', 'max')).toBeNull();
    });

    // #1014
    it('isValidField()', function() {
        this.$email.val('email@domain.com');
        this.fv.validate();
        expect(this.fv.isValidField(this.$note)).toBeTruthy();
        expect(this.fv.isValidField(this.$email)).toBeTruthy();
    });

    // #1014
    it('validateField()', function() {
        this.$email.val('email@domain.com');
        this.fv.validateField(this.$email);
        this.fv.validateField(this.$note);
        expect(this.fv.isValidField(this.$email)).toBeTruthy();
        expect(this.fv.isValidField(this.$note)).toBeTruthy();
    });
});
