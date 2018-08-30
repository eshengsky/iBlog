describe('isbn', function() {
    beforeEach(function() {
        var html = [
            '<div class="container">',
                '<form class="form-horizontal" id="isbnForm">',
                    '<div class="form-group">',
                        '<input type="text" name="isbn" data-fv-isbn />',
                    '</div>',
                '</form>',
            '</div>'
        ].join('\n');

        $(html).appendTo('body');
        $('#isbnForm').formValidation();

        this.fv    = $('#isbnForm').data('formValidation');
        this.$isbn = this.fv.getFieldElements('isbn');
    });

    afterEach(function() {
        $('#isbnForm').formValidation('destroy').parent().remove();
    });

    it('isbn10 hyphen', function() {
        var samples = ['99921-58-10-7', '9971-5-0210-0', '960-425-059-0', '80-902734-1-6'];

        for (var i in samples) {
            this.$isbn.val(samples[i]);
            this.fv.validate();
            expect(this.fv.isValidField('isbn')).toBeTruthy();
        }
    });

    it('isbn10 space', function() {
        var samples = ['85 359 0277 5', '1 84356 028 3', '0 684 84328 5', '0 85131 041 9', '0 943396 04 2'];

        for (var i in samples) {
            this.$isbn.val(samples[i]);
            this.fv.validate();
            expect(this.fv.isValidField('isbn')).toBeTruthy();
        }
    });

    it('isbn10 hyphen with X', function() {
        var samples = ['0-8044-2957-X', '0-9752298-0-X'];
        for (var i in samples) {
            this.$isbn.val(samples[i]);
            this.fv.validate();
            expect(this.fv.isValidField('isbn')).toBeTruthy();
        }
    });

    it('isbn10 invalid check digit', function() {
        this.$isbn.val('99921-58-10-6');
        this.fv.validate();
        expect(this.fv.isValidField('isbn')).toEqual(false);
    });

    it('isbn13', function() {
        this.$isbn.val('978-0-306-40615-7');
        this.fv.validate();
        expect(this.fv.isValidField('isbn')).toBeTruthy();
    });

    it('isbn13 invalid check digit', function() {
        this.$isbn.val('978-0-306-40615-6');
        this.fv.validate();
        expect(this.fv.isValidField('isbn')).toEqual(false);
    });
});
