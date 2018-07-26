describe('imo', function() {
    beforeEach(function() {
        $([
            '<form class="form-horizontal" id="imoForm">',
                '<div class="form-group">',
                    '<input type="text" name="imo" data-fv-imo />',
                '</div>',
            '</form>'
        ].join('\n')).appendTo('body');

        $('#imoForm').formValidation();

        this.fv   = $('#imoForm').data('formValidation');
        this.$imo = this.fv.getFieldElements('imo');
    });

    afterEach(function() {
        $('#imoForm').formValidation('destroy').remove();
    });

    it('Valid IMO (upper)', function() {
        this.fv.resetForm();
        this.$imo.val('IMO 9074729');
        this.fv.validate();
        expect(this.fv.isValid()).toBeTruthy();
    });

    it('Valid IMO (lower)', function() {
        this.fv.resetForm();
        this.$imo.val('imo 9074729');
        this.fv.validate();
        expect(this.fv.isValid()).toBeTruthy();
    });

    it('Invalid IMO (bad format)', function() {
        this.fv.resetForm();
        this.$imo.val('9074729');
        this.fv.validate();
        expect(this.fv.isValid()).toBeFalsy();
    });

    it('Invalid IMO (bad check digit)', function() {
        this.fv.resetForm();
        this.$imo.val('IMO 9074728');
        this.fv.validate();
        expect(this.fv.isValid()).toBeFalsy();
    });
});
