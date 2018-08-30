TestSuite = $.extend({}, TestSuite, {
    Transformer: {
        uri: function($field, validator) {
            var value = $field.val();
            if (value && value.substr(0, 7) !== 'http://' && value.substr(0, 8) !== 'https://') {
                value = 'http://' + value;
            }
            return value;
        }
    }
});

describe('transformer', function() {
    beforeEach(function() {
        $([
            '<form class="form-horizontal" id="transformerForm">',
                '<div class="form-group">',
                    '<input type="text" name="website" data-fv-uri />',
                '</div>',
            '</form>'
        ].join('\n')).appendTo('body');

        $('#transformerForm').formValidation();

        this.fv       = $('#transformerForm').data('formValidation');
        this.$website = this.fv.getFieldElements('website');
    });

    afterEach(function() {
        $('#transformerForm').formValidation('destroy').remove();
    });

    it('transformer not set', function() {
        this.$website.val('foo.com');
        this.fv.validate();
        expect(this.fv.isValid()).toBeFalsy();
    });

    it('programmatically usage', function() {
        this.fv = $('#transformerForm')
                    .formValidation('destroy')
                    .formValidation({
                        fields: {
                            website: {
                                validators: {
                                    uri: {
                                        transformer: function($field, validator) {
                                            var value = $field.val();
                                            if (value && value.substr(0, 7) !== 'http://' && value.substr(0, 8) !== 'https://') {
                                                value = 'http://' + value;
                                            }
                                            return value;
                                        }
                                    }
                                }
                            }
                        }
                    })
                    .data('formValidation');
        this.$website.val('foo.com');
        this.fv.validate();
        expect(this.fv.isValid()).toBeTruthy();

        this.fv.resetForm();
        this.$website.val('http://foo.com');
        this.fv.validate();
        expect(this.fv.isValid()).toBeTruthy();

        this.fv.resetForm();
        this.$website.val('https://foo.com');
        this.fv.validate();
        expect(this.fv.isValid()).toBeTruthy();
    });

    it('declarative usage', function() {
        this.$website.attr('data-fv-uri-transformer', 'TestSuite.Transformer.uri');

        this.fv = $('#transformerForm')
                    .formValidation('destroy')
                    .formValidation()
                    .data('formValidation');

        this.$website.val('foo.com');
        this.fv.validate();
        expect(this.fv.isValid()).toBeTruthy();

        this.fv.resetForm();
        this.$website.val('http://foo.com');
        this.fv.validate();
        expect(this.fv.isValid()).toBeTruthy();

        this.fv.resetForm();
        this.$website.val('https://foo.com');
        this.fv.validate();
        expect(this.fv.isValid()).toBeTruthy();
    });

    it('update via updateOption()', function() {
        this.fv.updateOption('website', 'uri', 'transformer', 'TestSuite.Transformer.uri');

        this.$website.val('foo.com');
        this.fv.validate();
        expect(this.fv.isValid()).toBeTruthy();

        this.fv.resetForm();
        this.$website.val('http://foo.com');
        this.fv.validate();
        expect(this.fv.isValid()).toBeTruthy();

        this.fv.resetForm();
        this.$website.val('https://foo.com');
        this.fv.validate();
        expect(this.fv.isValid()).toBeTruthy();
    });
});