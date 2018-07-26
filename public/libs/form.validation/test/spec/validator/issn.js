describe('issn', function() {
    beforeEach(function() {
        var html = [
            '<div class="container">',
                '<form class="form-horizontal" id="issnForm">',
                    '<div class="form-group">',
                        '<input type="text" name="issn" data-fv-issn />',
                    '</div>',
                '</form>',
            '</div>'
        ].join('\n');

        $(html).appendTo('body');
        $('#issnForm').formValidation();

        this.fv    = $('#issnForm').data('formValidation');
        this.$issn = this.fv.getFieldElements('issn');
    });

    afterEach(function() {
        $('#issnForm').formValidation('destroy').parent().remove();
    });

    it('valid', function() {
        var samples = ['0378-5955', '0024-9319', '0032-1478'];

        for (var i in samples) {
            this.$issn.val(samples[i]);
            this.fv.validate();
            expect(this.fv.isValidField('issn')).toBeTruthy();
        }
    });

    it('not contains hyphen', function() {
        this.$issn.val('03785955');
        this.fv.validate();
        expect(this.fv.isValidField('issn')).toEqual(false);
    });

    it('contains only digits, X', function() {
        this.$issn.val('1234-566A');
        this.fv.validate();
        expect(this.fv.isValidField('issn')).toEqual(false);
    });

    it('invalid check sum', function() {
        this.$issn.val('0032-147X');
        this.fv.validate();
        expect(this.fv.isValidField('issn')).toEqual(false);
    });
});
