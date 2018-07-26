describe('identical', function() {
    beforeEach(function() {
        $([
            '<form class="form-horizontal" id="identicalForm">',
                '<div class="form-group">',
                    '<input type="hidden" name="hiddenField" value="abcdef" />',
                '</div>',
                '<div class="form-group">',
                    '<input type="text" name="a" />',
                '</div>',
                '<div class="form-group">',
                    '<input type="text" name="b" data-fv-identical="true" data-fv-identical-field="a" />',
                '</div>',
            '</form>'
        ].join('\n')).appendTo('body');

        $('#identicalForm').formValidation();

        this.fv = $('#identicalForm').data('formValidation');
        this.$a = this.fv.getFieldElements('a');
        this.$b = this.fv.getFieldElements('b');
    });

    afterEach(function () {
        $('#identicalForm').formValidation('destroy').remove();
    });

    // #1267
    it('compare to field which does not use any validators', function() {
        this.$a.val('123');
        this.$b.val('123abc');
        this.fv.validate();
        expect(this.fv.isValid()).toEqual(false);

        this.fv.resetForm();
        this.$a.val('123456');
        this.$b.val('123456');
        this.fv.validate();
        expect(this.fv.isValid()).toEqual(true);
    });

    it('compare to hidden field', function() {
        this.$b.attr('data-fv-identical-field', 'hiddenField');

        this.fv = $('#identicalForm').formValidation('destroy').formValidation().data('formValidation');
        this.$b.val('123abc');
        this.fv.validate();
        expect(this.fv.isValid()).toEqual(false);

        this.fv.resetForm();
        this.$b.val('abcdef');
        this.fv.validate();
        expect(this.fv.isValid()).toEqual(true);
    });
});