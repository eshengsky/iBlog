describe('isin', function() {
    beforeEach(function() {
        var html = [
            '<div class="container">',
                '<form class="form-horizontal" id="isinForm">',
                    '<div class="form-group">',
                        '<input type="text" name="isin" data-fv-isin />',
                    '</div>',
                '</form>',
            '</div>'
        ].join('\n');

        $(html).appendTo('body');
        $('#isinForm').formValidation();

        this.fv    = $('#isinForm').data('formValidation');
        this.$isin = this.fv.getFieldElements('isin');
    });

    afterEach(function() {
        $('#isinForm').formValidation('destroy').parent().remove();
    });

    it('valid', function() {
        var samples = ['US0378331005', 'AU0000XVGZA3', 'GB0002634946'];

        for (var i in samples) {
            this.$isin.val(samples[i]);
            this.fv.validate();
            expect(this.fv.isValidField('isin')).toBeTruthy();
        }
    });

    it('invalid country code', function() {
        this.$isin.val('AA0000XVGZA3');
        this.fv.validate();
        expect(this.fv.isValidField('isin')).toEqual(false);
    });

    it('contains only digits and alphabet', function() {
        this.$isin.val('US12345ABC@#$');
        this.fv.validate();
        expect(this.fv.isValidField('isin')).toEqual(false);
    });

    it('invalid length', function() {
        this.$isin.val('US1234567');
        this.fv.validate();
        expect(this.fv.isValidField('isin')).toEqual(false);
    });

    it('invalid check digit', function() {
        this.$isin.val('US0378331004');
        this.fv.validate();
        expect(this.fv.isValidField('isin')).toEqual(false);
    });
});
