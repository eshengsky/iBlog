describe('creditCard', function() {
    // Get the fake credit card number at http://www.getcreditcardnumbers.com/

    beforeEach(function() {
        var html = [
            '<div class="container">',
                '<form class="form-horizontal" id="ccForm">',
                    '<div class="form-group">',
                        '<input type="text" name="cc" data-fv-creditcard />',
                    '</div>',
                '</form>',
            '</div>'
        ].join('\n');

        $(html).appendTo('body');
        $('#ccForm').formValidation();

        this.fv          = $('#ccForm').data('formValidation');
        this.$creditCard = this.fv.getFieldElements('cc');
    });

    afterEach(function() {
        $('#ccForm').formValidation('destroy').parent().remove();
    });

    it('accept spaces', function() {
        this.$creditCard.val('5267 9789 9451 9654');
        this.fv.validate();
        expect(this.fv.isValidField('cc')).toBeTruthy();
    });

    it('accept dashes', function() {
        this.$creditCard.val('6011-2649-6840-4521');
        this.fv.validate();
        expect(this.fv.isValidField('cc')).toBeTruthy();
    });

    it('invalid format', function() {
        this.$creditCard.val('4539.1870.2954.3862');
        this.fv.validate();
        expect(this.fv.isValidField('cc')).toEqual(false);
    });

    it('American Express', function() {
        this.$creditCard.val('340653705597107');
        this.fv.validate();
        expect(this.fv.isValidField('cc')).toBeTruthy();
    });

    it('American Express invalid length', function() {
        this.$creditCard.val('3744148309166730');
        this.fv.validate();
        expect(this.fv.isValidField('cc')).toEqual(false);
    });

    it('American Express invalid prefix', function() {
        this.$creditCard.val('356120148436654');
        this.fv.validate();
        expect(this.fv.isValidField('cc')).toEqual(false);
    });

    it('Diners Club', function() {
        this.$creditCard.val('30130708434187');
        this.fv.validate();
        expect(this.fv.isValidField('cc')).toBeTruthy();
    });

    it('Diners Club (US)', function() {
        this.$creditCard.val('5517479515603901');
        this.fv.validate();
        expect(this.fv.isValidField('cc')).toBeTruthy();
    });

    it('Discover', function() {
        this.$creditCard.val('6011734674929094');
        this.fv.validate();
        expect(this.fv.isValidField('cc')).toBeTruthy();
    });

    it('JCB', function() {
        this.$creditCard.val('3566002020360505');
        this.fv.validate();
        expect(this.fv.isValidField('cc')).toBeTruthy();
    });

    it('Laser', function() {
        this.$creditCard.val('6304 9000 1774 0292 441');
        this.fv.validate();
        expect(this.fv.isValidField('cc')).toBeTruthy();
    });

    it('Maestro', function() {
        this.$creditCard.val('6762835098779303');
        this.fv.validate();
        expect(this.fv.isValidField('cc')).toBeTruthy();
    });

    it('Mastercard', function() {
        this.$creditCard.val('5303765013600904');
        this.fv.validate();
        expect(this.fv.isValidField('cc')).toBeTruthy();
    });

    it('Solo', function() {
        this.$creditCard.val('6334580500000000');
        this.fv.validate();
        expect(this.fv.isValidField('cc')).toBeTruthy();
    });

    it('Visa', function() {
        this.$creditCard.val('4929248980295542');
        this.fv.validate();
        expect(this.fv.isValidField('cc')).toBeTruthy();
    });

    it('Visa invalid check digit', function() {
        this.$creditCard.val('4532599916257826');
        this.fv.validate();
        expect(this.fv.isValidField('cc')).toEqual(false);
    });
});
