describe('cusip', function() {
    beforeEach(function() {
        $([
            '<form class="form-horizontal" id="cusipForm">',
                '<div class="form-group">',
                    '<input type="text" name="cusip" data-fv-cusip />',
                '</div>',
            '</form>'
        ].join('\n')).appendTo('body');
        $('#cusipForm').formValidation();

        this.fv     = $('#cusipForm').data('formValidation');
        this.$cusip = this.fv.getFieldElements('cusip');
    });

    afterEach(function() {
        $('#cusipForm').formValidation('destroy').remove();
    });

    it('valid', function() {
        var samples = ['037833100', '931142103', '14149YAR8', '126650BG6'];

        for (var i in samples) {
            this.fv.resetForm();
            this.$cusip.val(samples[i]);
            this.fv.validate();
            expect(this.fv.isValidField('cusip')).toBeTruthy();
        }
    });

    it('invalid', function() {
        var samples = ['31430F200', '022615AC2'];

        for (var i in samples) {
            this.fv.resetForm();
            this.$cusip.val(samples[i]);
            this.fv.validate();
            expect(this.fv.isValidField('cusip')).toEqual(false);
        }
    });
});
