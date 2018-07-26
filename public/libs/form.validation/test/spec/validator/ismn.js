describe('ismn', function() {
    beforeEach(function() {
        var html = [
            '<div class="container">',
                '<form class="form-horizontal" id="ismnForm">',
                    '<div class="form-group">',
                        '<input type="text" name="ismn" data-fv-ismn />',
                    '</div>',
                '</form>',
            '</div>'
        ].join('\n');

        $(html).appendTo('body');
        $('#ismnForm').formValidation();

        this.fv    = $('#ismnForm').data('formValidation');
        this.$ismn = this.fv.getFieldElements('ismn');
    });

    afterEach(function() {
        $('#ismnForm').formValidation('destroy').parent().remove();
    });

    it('valid start with M', function() {
        this.$ismn.val('M230671187');
        this.fv.validate();
        expect(this.fv.isValidField('ismn')).toBeTruthy();
    });

    it('valid start with 979', function() {
        this.$ismn.val('9790060115615');
        this.fv.validate();
        expect(this.fv.isValidField('ismn')).toBeTruthy();
    });

    it('valid contains spaces', function() {
        this.$ismn.val('979 0 3452 4680 5');
        this.fv.validate();
        expect(this.fv.isValidField('ismn')).toBeTruthy();
    });

    it('valid contains dashes', function() {
        this.$ismn.val('979-0-0601-1561-5');
        this.fv.validate();
        expect(this.fv.isValidField('ismn')).toBeTruthy();
    });

    it('invalid format', function() {
        this.$ismn.val('N123456789');
        this.fv.validate();
        expect(this.fv.isValidField('ismn')).toEqual(false);
    });

    it('invalid check digit', function() {
        this.$ismn.val('9790060115614');
        this.fv.validate();
        expect(this.fv.isValidField('ismn')).toEqual(false);
    });
});
