describe('stringLength', function() {
    beforeEach(function() {
        $([
            '<form class="form-horizontal" id="stringLengthForm">',
                '<div class="form-group">',
                    '<input type="text" name="textCharMaxLength" data-fv-stringlength data-fv-stringlength-max="10" />',
                '</div>',
                '<div class="form-group">',
                    '<textarea name="textareaCharMaxLength" data-fv-stringlength data-fv-stringlength-max="10"></textarea>',
                '</div>',
                '<div class="form-group">',
                    '<input type="text" name="textUTF8BytesMaxLength" data-fv-stringlength data-fv-stringlength-utf8bytes="true" data-fv-stringlength-max="10" />',
                '</div>',
                '<div class="form-group">',
                    '<textarea name="textareaUTF8BytesMaxLength" data-fv-stringlength data-fv-stringlength-utf8bytes="true" data-fv-stringlength-max="10"></textarea>',
                '</div>',
                '<div class="form-group">',
                    '<input type="text" name="textCharMinLength" data-fv-stringlength data-fv-stringlength-min="5" />',
                '</div>',
                '<div class="form-group">',
                    '<textarea name="textareaCharMinLength" data-fv-stringlength data-fv-stringlength-min="5"></textarea>',
                '</div>',
                '<div class="form-group">',
                    '<input type="text" name="textUTF8BytesMinLength" data-fv-stringlength data-fv-stringlength-utf8bytes="true" data-fv-stringlength-min="5" />',
                '</div>',
                '<div class="form-group">',
                    '<textarea name="textareaUTF8BytesMinLength" data-fv-stringlength data-fv-stringlength-utf8bytes="true" data-fv-stringlength-min="5"></textarea>',
                '</div>',
                '<div class="form-group">',
                    '<input type="text" name="textCharMinMaxLength" data-fv-stringlength data-fv-stringlength-min="5" data-fv-stringlength-max="10" />',
                '</div>',
                '<div class="form-group">',
                    '<textarea name="textareaCharMinMaxLength" data-fv-stringlength data-fv-stringlength-min="5" data-fv-stringlength-max="10"></textarea>',
                '</div>',
                '<div class="form-group">',
                    '<input type="text" name="textUTF8BytesMinMaxLength" data-fv-stringlength data-fv-stringlength-utf8bytes="true" data-fv-stringlength-min="5" data-fv-stringlength-max="10" />',
                '</div>',
                '<div class="form-group">',
                    '<textarea name="textareaUTF8BytesMinMaxLength" data-fv-stringlength data-fv-stringlength-utf8bytes="true" data-fv-stringlength-min="5" data-fv-stringlength-max="10"></textarea>',
                '</div>',
            '</form>'
        ].join('\n')).appendTo('body');

        $('#stringLengthForm').formValidation();

        this.fv                             = $('#stringLengthForm').data('formValidation');
        this.$textCharMaxLength             = this.fv.getFieldElements('textCharMaxLength');
        this.$textareaCharMaxLength         = this.fv.getFieldElements('textareaCharMaxLength');
        this.$textUTF8BytesMaxLength        = this.fv.getFieldElements('textUTF8BytesMaxLength');
        this.$textareaUTF8BytesMaxLength    = this.fv.getFieldElements('textareaUTF8BytesMaxLength');
        this.$textCharMinLength             = this.fv.getFieldElements('textCharMinLength');
        this.$textareaCharMinLength         = this.fv.getFieldElements('textareaCharMinLength');
        this.$textUTF8BytesMinLength        = this.fv.getFieldElements('textUTF8BytesMinLength');
        this.$textareaUTF8BytesMinLength    = this.fv.getFieldElements('textareaUTF8BytesMinLength');
        this.$textCharMinMaxLength          = this.fv.getFieldElements('textCharMinMaxLength');
        this.$textareaCharMinMaxLength      = this.fv.getFieldElements('textareaCharMinMaxLength');
        this.$textUTF8BytesMinMaxLength     = this.fv.getFieldElements('textUTF8BytesMinMaxLength');
        this.$textareaUTF8BytesMinMaxLength = this.fv.getFieldElements('textareaUTF8BytesMinMaxLength');
    });

    afterEach(function() {
        $('#stringLengthForm').formValidation('destroy').remove();
    });

    it('Valid max lengths', function() {
        this.$textCharMaxLength.val('123456789♥');
        this.$textareaCharMaxLength.val('123456789♥');
        this.$textUTF8BytesMaxLength.val('1234567♥');
        this.$textareaUTF8BytesMaxLength.val('1234567♥');
        this.fv.validate();
        expect(this.fv.isValid()).toBeTruthy();
    });

    it('Valid min lengths', function() {
        this.$textCharMinLength.val('1234♥');
        this.$textareaCharMinLength.val('1234♥');
        this.$textUTF8BytesMinLength.val('12♥');
        this.$textareaUTF8BytesMinLength.val('12♥');
        this.fv.validate();
        expect(this.fv.isValid()).toBeTruthy();
    });

    it('Valid min and max lengths', function() {
        this.$textCharMinMaxLength.val('1234♥');
        this.$textareaCharMinMaxLength.val('1234♥');
        this.$textUTF8BytesMinMaxLength.val('12♥');
        this.$textareaUTF8BytesMinMaxLength.val('12♥');
        this.fv.validate();
        expect(this.fv.isValid()).toBeTruthy();

        this.fv.resetForm();
        this.$textCharMinMaxLength.val('123456789♥');
        this.$textareaCharMinMaxLength.val('123456789♥');
        this.$textUTF8BytesMinMaxLength.val('1234567♥');
        this.$textareaUTF8BytesMinMaxLength.val('1234567♥');
        this.fv.validate();
        expect(this.fv.isValid()).toBeTruthy();
    });

    it('Invalid max lengths', function() {
        this.$textCharMaxLength.val('1234567890♥');           // 11 chars when max is 10
        this.fv.validate();
        expect(this.fv.isValid()).toEqual(false);

        this.fv.resetForm();
        this.$textareaCharMaxLength.val('1234567890♥');       // 11 chars when max is 10
        this.fv.validate();
        expect(this.fv.isValid()).toEqual(false);

        this.fv.resetForm();
        this.$textUTF8BytesMaxLength.val('12345678♥');        // 11 UTF-8 bytes when max is 10
        this.fv.validate();
        expect(this.fv.isValid()).toEqual(false);

        this.fv.resetForm();
        this.$textareaUTF8BytesMaxLength.val('12345678♥');    // 11 UTF-8 bytes when max is 10
        this.fv.validate();
        expect(this.fv.isValid()).toEqual(false);
    });

    it('Invalid min lengths', function() {
        this.$textCharMinLength.val('123♥');                  // 4 chars when min is 5
        this.fv.validate();
        expect(this.fv.isValid()).toEqual(false);

        this.fv.resetForm();
        this.$textareaCharMinLength.val('123♥');              // 4 chars when min is 5
        this.fv.validate();
        expect(this.fv.isValid()).toEqual(false);

        this.fv.resetForm();
        this.$textUTF8BytesMinLength.val('1♥');               // 4 UTF-8 bytes when min is 5
        this.fv.validate();
        expect(this.fv.isValid()).toEqual(false);

        this.fv.resetForm();
        this.$textareaUTF8BytesMinLength.val('1♥');           // 4 UTF-8 bytes when min is 5
        this.fv.validate();
        expect(this.fv.isValid()).toEqual(false);
    });

    it('Invalid min and max lengths', function() {
        this.$textCharMinMaxLength.val('123♥');               // 4 chars when min is 5 and max is 10
        this.fv.validate();
        expect(this.fv.isValid()).toEqual(false);

        this.fv.resetForm();
        this.$textareaCharMinMaxLength.val('123♥');           // 4 chars when min is 5 and max is 10
        this.fv.validate();
        expect(this.fv.isValid()).toEqual(false);

        this.fv.resetForm();
        this.$textUTF8BytesMinMaxLength.val('1♥');            // 4 UTF-8 bytes when min is 5 and max is 10
        this.fv.validate();
        expect(this.fv.isValid()).toEqual(false);

        this.fv.resetForm();
        this.$textareaUTF8BytesMinMaxLength.val('1♥');        // 4 UTF-8 bytes when min is 5 and max is 10
        this.fv.validate();
        expect(this.fv.isValid()).toEqual(false);

        this.fv.resetForm();
        this.$textCharMinMaxLength.val('1234567890♥');        // 11 chars when min is 5 and max is 10
        this.fv.validate();
        expect(this.fv.isValid()).toEqual(false);

        this.fv.resetForm();
        this.$textareaCharMinMaxLength.val('1234567890♥');    // 11 chars when min is 5 and max is 10
        this.fv.validate();
        expect(this.fv.isValid()).toEqual(false);

        this.fv.resetForm();
        this.$textUTF8BytesMinMaxLength.val('12345678♥');     // 11 UTF-8 bytes when min is 5 and max is 10
        this.fv.validate();
        expect(this.fv.isValid()).toEqual(false);

        this.fv.resetForm();
        this.$textareaUTF8BytesMinMaxLength.val('12345678♥'); // 11 UTF-8 bytes when min is 5 and max is 10
        this.fv.validate();
        expect(this.fv.isValid()).toEqual(false);
    });

    it('trim option', function() {
        this.fv.updateOption('textCharMaxLength', 'stringLength', 'trim', false);
        this.$textCharMaxLength.val('');
        this.fv.validate();
        expect(this.fv.isValid()).toEqual(true);

        this.fv.resetForm();
        this.$textCharMaxLength.val('           ');
        this.fv.validate();
        expect(this.fv.isValid()).toEqual(false);

        this.fv.resetForm();
        this.$textCharMaxLength.val('1234567890   ');
        this.fv.validate();
        expect(this.fv.isValid()).toEqual(false);

        this.fv.updateOption('textCharMaxLength', 'stringLength', 'trim', true);
        this.fv.resetForm();
        this.$textCharMaxLength.val('   ');
        this.fv.validate();
        expect(this.fv.isValid()).toEqual(true);

        this.fv.resetForm();
        this.$textCharMaxLength.val('                ');
        this.fv.validate();
        expect(this.fv.isValid()).toEqual(true);

        this.fv.resetForm();
        this.$textCharMaxLength.val('  0123456789   ');
        this.fv.validate();
        expect(this.fv.isValid()).toEqual(true);

        this.fv.resetForm();
        this.$textCharMaxLength.val('  01234567890  ');
        this.fv.validate();
        expect(this.fv.isValid()).toEqual(false);
    });
});
