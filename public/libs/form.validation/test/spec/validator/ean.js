describe('ean', function() {
    beforeEach(function() {
        var html = [
            '<div class="container">',
                '<form class="form-horizontal" id="eanForm">',
                    '<div class="form-group">',
                        '<input type="text" name="ean" data-fv-ean />',
                    '</div>',
                '</form>',
            '</div>'
        ].join('\n');

        $(html).appendTo('body');
        $('#eanForm').formValidation();

        this.fv   = $('#eanForm').data('formValidation');
        this.$ean = this.fv.getFieldElements('ean');
    });

    afterEach(function() {
        $('#eanForm').formValidation('destroy').parent().remove();
    });

    it('valid', function() {
        var samples = ['73513537', '9780471117094', '4006381333931'];

        for (var i in samples) {
            this.$ean.val(samples[i]);
            this.fv.validate();
            expect(this.fv.isValidField('ean')).toBeTruthy();
        }
    });

    it('contains only digits', function() {
        this.$ean.val('123abcDEF!@#');
        this.fv.validate();
        expect(this.fv.isValidField('ean')).toEqual(false);
    });

    it('invalid length', function() {
        this.$ean.val('1234567');
        this.fv.validate();
        expect(this.fv.isValidField('ean')).toEqual(false);
    });

    it('invalid check digit', function() {
        this.$ean.val('73513536');
        this.fv.validate();
        expect(this.fv.isValidField('ean')).toEqual(false);
    });
});
