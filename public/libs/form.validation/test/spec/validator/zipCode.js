function getCountryCode(value, validator, $field) {
    $('#msg').html('getCountryCode() called');
    return validator.getFieldElements('country').val();
};

TestSuite = $.extend({}, TestSuite, {
    ZipCode: {
        getCountryCode: function(value, validator, $field) {
            $('#msg').html('TestSuite.ZipCode.getCountryCode() called');
            return validator.getFieldElements('country').val();
        }
    }
});

describe('zipCode', function() {
    beforeEach(function() {
        $([
            '<form class="form-horizontal" id="zipCodeForm">',
                '<div id="msg"></div>',
                '<div class="form-group">',
                    '<label class="col-md-3 control-label">Country:</label>',
                    '<div class="col-md-2">',
                        '<select class="form-control" name="country">',
                            '<option value="">Select a country</option>',
                            '<option value="CA">Canada</option>',
                            '<option value="CZ">Czech Republic</option>',
                            '<option value="DK">Denmark</option>',
                            '<option value="ES">Spain</option>',
                            '<option value="FR">France</option>',
                            '<option value="GB">United Kingdom</option>',
                            '<option value="IE">Ireland</option>',
                            '<option value="IN">India</option>',
                            '<option value="IT">Italy</option>',
                            '<option value="NL">Netherlands</option>',
                            '<option value="PL">Poland</option>',
                            '<option value="PT">Portugal</option>',
                            '<option value="SE">Sweden</option>',
                            '<option value="SK">Slovakia</option>',
                            '<option value="US">United States</option>',
                        '</select>',
                    '</div>',
                '</div>',
                '<div class="form-group">',
                    '<label class="col-md-3 control-label">Zipcode</label>',
                    '<div class="col-md-2">',
                        '<input type="text" class="form-control" name="zc" data-fv-zipcode data-fv-zipcode-country="US" />',
                    '</div>',
                '</div>',
            '</form>'
        ].join('\n')).appendTo('body');

        $('#zipCodeForm').formValidation();

        /**
         * @type {BootstrapValidator}
         */
        this.fv       = $('#zipCodeForm').data('formValidation');

        this.$country = this.fv.getFieldElements('country');
        this.$zipCode = this.fv.getFieldElements('zc');
    });

    afterEach(function() {
        $('#zipCodeForm').formValidation('destroy').remove();
    });

    it('country code updateOption()', function() {
        // Check IT postal code
        this.fv.updateOption('zc', 'zipCode', 'country', 'IT');
        this.$zipCode.val('1234');
        this.fv.validate();
        expect(this.fv.isValid()).toEqual(false);

        this.fv.resetForm();
        this.$zipCode.val('IT-12345');
        this.fv.validate();
        expect(this.fv.isValid()).toBeTruthy();

        // Check United Kingdom postal code
        this.fv.updateOption('zc', 'zipCode', 'country', 'GB');
        var validUkSamples = ['EC1A 1BB', 'W1A 1HQ', 'M1 1AA', 'B33 8TH', 'CR2 6XH', 'DN55 1PT', 'AI-2640', 'ASCN 1ZZ', 'GIR 0AA'];

        for (var i in validUkSamples) {
            this.fv.resetForm();
            this.$zipCode.val(validUkSamples[i]);
            this.fv.validate();
            expect(this.fv.isValid()).toBeTruthy();
        }
    });

    it('country code other field declarative', function() {
        this.$zipCode.attr('data-fv-zipcode-country', 'country');

        // Need to destroy the plugin instance ...
        $('#zipCodeForm').formValidation('destroy');

        // ... and re-create it
        this.fv = $('#zipCodeForm').formValidation().data('formValidation');
        this.$country.val('IT');

        this.fv.resetForm();
        this.$zipCode.val('1234');
        this.fv.validate();
        expect(this.fv.isValid()).toEqual(false);

        this.fv.resetForm();
        this.$zipCode.val('I-12345');
        this.fv.validate();
        expect(this.fv.isValid()).toBeTruthy();
    });

    it('country code callback declarative function', function() {
        this.$zipCode.attr('data-fv-zipcode-country', 'getCountryCode');
        $('#zipCodeForm').formValidation('destroy');
        this.fv = $('#zipCodeForm').formValidation().data('formValidation');
        this.$country.val('NL');
        this.$zipCode.val('0123');
        this.fv.validate();
        expect($('#msg').html()).toEqual('getCountryCode() called');
        expect(this.fv.isValid()).toEqual(false);
    });

    it('country code callback declarative function()', function() {
        this.$zipCode.attr('data-fv-zipcode-country', 'getCountryCode()');
        $('#zipCodeForm').formValidation('destroy');
        this.fv = $('#zipCodeForm').formValidation().data('formValidation');
        this.$country.val('NL');
        this.$zipCode.val('1234 ab');
        this.fv.validate();
        expect($('#msg').html()).toEqual('getCountryCode() called');
        expect(this.fv.isValid()).toBeTruthy();
    });

    it('country code callback declarative A.B.C', function() {
        this.$zipCode.attr('data-fv-zipcode-country', 'TestSuite.ZipCode.getCountryCode');
        $('#zipCodeForm').formValidation('destroy');
        this.fv = $('#zipCodeForm').formValidation().data('formValidation');
        this.$country.val('DK');
        this.$zipCode.val('DK 123');
        this.fv.validate();
        expect($('#msg').html()).toEqual('TestSuite.ZipCode.getCountryCode() called');
        expect(this.fv.isValid()).toEqual(false);
    });

    it('country code callback declarative A.B.C()', function() {
        this.$zipCode.attr('data-fv-zipcode-country', 'TestSuite.ZipCode.getCountryCode()');
        $('#zipCodeForm').formValidation('destroy');
        this.fv = $('#zipCodeForm').formValidation().data('formValidation');
        this.$country.val('DK');
        this.$zipCode.val('DK-1234');
        this.fv.validate();
        expect($('#msg').html()).toEqual('TestSuite.ZipCode.getCountryCode() called');
        expect(this.fv.isValid()).toBeTruthy();
    });

    it('country code callback programmatically', function() {
        this.$zipCode.removeAttr('data-fv-zipcode-country');
        $('#zipCodeForm').formValidation('destroy');
        this.fv = $('#zipCodeForm')
                        .formValidation({
                            fields: {
                                zc: {
                                    validators: {
                                        zipCode: {
                                            country: function(value, validator, $field) {
                                                return getCountryCode(value, validator, $field);
                                            }
                                        }
                                    }
                                }
                            }
                        })
                        .data('formValidation');
        this.$country.val('SE');

        this.fv.resetForm();
        this.$zipCode.val('S-567 8');
        this.fv.validate();
        expect($('#msg').html()).toEqual('getCountryCode() called');
        expect(this.fv.isValid()).toEqual(false);

        this.fv.resetForm();
        this.$zipCode.val('S-12345');
        this.fv.validate();
        expect($('#msg').html()).toEqual('getCountryCode() called');
        expect(this.fv.isValid()).toBeTruthy();
    });

    it('not supported country code', function() {
        this.$zipCode.attr('data-fv-zipcode-country', 'NOT_SUPPORTED');

        $('#zipCodeForm').formValidation('destroy');

        this.fv = $('#zipCodeForm').formValidation().data('formValidation');

        this.fv.resetForm();
        this.$zipCode.val('1234');
        this.fv.validate();
        expect(this.fv.isValid()).toBeTruthy();
    });

    it('US zipcode', function() {
        this.$zipCode.val('12345');
        this.fv.validate();
        expect(this.fv.isValid()).toBeTruthy();

        this.fv.resetForm();
        this.$zipCode.val('123');
        this.fv.validate();
        expect(this.fv.isValid()).toEqual(false);
    });

    it('Czech Republic postal code', function() {
        this.fv.updateOption('zc', 'zipCode', 'country', 'CZ');

        // Valid samples
        var validSamples = ['12345', '123 45'];
        for (var i in validSamples) {
            this.fv.resetForm();
            this.$zipCode.val(validSamples[i]);
            this.fv.validate();
            expect(this.fv.isValid()).toBeTruthy();
        }

        // Invalid samples
        var invalidSamples = ['12 345', '123456', '1 2345', '1234 5', '12 3 45'];
        for (i in invalidSamples) {
            this.fv.resetForm();
            this.$zipCode.val(invalidSamples[i]);
            this.fv.validate();
            expect(this.fv.isValid()).toEqual(false);
        }
    });

    it('Slovakia postal code', function() {
        this.fv.updateOption('zc', 'zipCode', 'country', 'SK');

        // Valid samples
        var validSamples = ['12345', '123 45'];
        for (var i in validSamples) {
            this.fv.resetForm();
            this.$zipCode.val(validSamples[i]);
            this.fv.validate();
            expect(this.fv.isValid()).toBeTruthy();
        }

        // Invalid samples
        var invalidSamples = ['12 345', '123456', '1 2345', '1234 5', '12 3 45'];
        for (i in invalidSamples) {
            this.fv.resetForm();
            this.$zipCode.val(invalidSamples[i]);
            this.fv.validate();
            expect(this.fv.isValid()).toEqual(false);
        }
    });

    it('France postal code', function() {
        this.fv.updateOption('zc', 'zipCode', 'country', 'FR');

        // Valid samples
        var validSamples = ['12340', '01230', '75116'];
        for (var i in validSamples) {
            this.fv.resetForm();
            this.$zipCode.val(validSamples[i]);
            this.fv.validate();
            expect(this.fv.isValid()).toBeTruthy();
        }

        // Invalid samples
        var invalidSamples = ['123 45', '12 345', '123456', '1 2345', '1234 5', '12 3 45', '1234A'];
        for (i in invalidSamples) {
            this.fv.resetForm();
            this.$zipCode.val(invalidSamples[i]);
            this.fv.validate();
            expect(this.fv.isValid()).toEqual(false);
        }
    });

    it('Eircode (Ireland postal code)', function() {
        this.fv.updateOption('zc', 'zipCode', 'country', 'IE');

        // Valid samples
        var validSamples = ['A65 F4E2', 'D6W FNT4', 'T37 F8HK'];
        for (var i in validSamples) {
            this.fv.resetForm();
            this.$zipCode.val(validSamples[i]);
            this.fv.validate();
            expect(this.fv.isValid()).toBeTruthy();
        }

        // Invalid samples
        var invalidSamples = ['a65 f4e2', 'D6W FNTO', 'T37F8HK'];
        for (i in invalidSamples) {
            this.fv.resetForm();
            this.$zipCode.val(invalidSamples[i]);
            this.fv.validate();
            expect(this.fv.isValid()).toEqual(false);
        }
    });
    
    it('Poland postal code', function() {
        this.fv.updateOption('zc', 'zipCode', 'country', 'PL');

        // Valid samples
        var validSamples = ['02-920', '00-002', '77-400'];
        for (var i in validSamples) {
            this.fv.resetForm();
            this.$zipCode.val(validSamples[i]);
            this.fv.validate();
            expect(this.fv.isValid()).toBeTruthy();
        }

        // Invalid samples
        var invalidSamples = ['03456', '000-02', 'AB-002', '12 345'];
        for (i in invalidSamples) {
            this.fv.resetForm();
            this.$zipCode.val(invalidSamples[i]);
            this.fv.validate();
            expect(this.fv.isValid()).toEqual(false);
        }
    });

    it('Portugal postal code', function() {
        this.fv.updateOption('zc', 'zipCode', 'country', 'PT');

        // Valid samples
        var validSamples = ['2435-459', '1000-000', '1234-456'];
        for (var i in validSamples) {
            this.fv.resetForm();
            this.$zipCode.val(validSamples[i]);
            this.fv.validate();
            expect(this.fv.isValid()).toBeTruthy();
        }

        // Invalid samples
        var invalidSamples = ['0123-456', '1234456', '1234-ABC', '1234 456'];
        for (i in invalidSamples) {
            this.fv.resetForm();
            this.$zipCode.val(invalidSamples[i]);
            this.fv.validate();
            expect(this.fv.isValid()).toEqual(false);
        }
    });

    it('Austria postal code', function() {
        this.fv.updateOption('zc', 'zipCode', 'country', 'AT');

        // Valid samples
        var validSamples = ['6020', '1010', '4853'];
        for (var i in validSamples) {
            this.fv.resetForm();
            this.$zipCode.val(validSamples[i]);
            this.fv.validate();
            expect(this.fv.isValid()).toBeTruthy();
        }

        // Invalid samples
        var invalidSamples = ['0020', '12345', '102', '12AB', 'AT 6020 XY'];
        for (i in invalidSamples) {
            this.fv.resetForm();
            this.$zipCode.val(invalidSamples[i]);
            this.fv.validate();
            expect(this.fv.isValid()).toEqual(false);
        }
    });

    it('Germany postal code', function() {
        this.fv.updateOption('zc', 'zipCode', 'country', 'DE');

        // Valid samples
        var validSamples = ['52238', '01001', '09107'];
        for (var i in validSamples) {
            this.fv.resetForm();
            this.$zipCode.val(validSamples[i]);
            this.fv.validate();
            expect(this.fv.isValid()).toBeTruthy();
        }

        // Invalid samples
        var invalidSamples = ['01000', '99999', '102', 'ABCDE', 'DE 52240 XY'];
        for (i in invalidSamples) {
            this.fv.resetForm();
            this.$zipCode.val(invalidSamples[i]);
            this.fv.validate();
            expect(this.fv.isValid()).toEqual(false);
        }
    });

    it('India postal code', function() {
        this.fv.updateOption('zc', 'zipCode', 'country', 'IN');

        // Valid samples
        var validSamples = ['226024', '456001', '571 120'];
        for (var i in validSamples) {
            this.fv.resetForm();
            this.$zipCode.val(validSamples[i]);
            this.fv.validate();
            expect(this.fv.isValid()).toBeTruthy();
        }
        
        // Invalid samples
        var invalidSamples = ['01000', '99999', '226-024', 'A226021'];
        for (i in invalidSamples) {
            this.fv.resetForm();
            this.$zipCode.val(invalidSamples[i]);
            this.fv.validate();
            expect(this.fv.isValid()).toEqual(false);
        }
    });
    
    it('Switzerland postal code', function() {
        this.fv.updateOption('zc', 'zipCode', 'country', 'CH');

        // Valid samples
        var validSamples = ['8280', '8090', '8238', '9490'];
        for (var i in validSamples) {
            this.fv.resetForm();
            this.$zipCode.val(validSamples[i]);
            this.fv.validate();
            expect(this.fv.isValid()).toBeTruthy();
        }

        // Invalid samples
        var invalidSamples = ['0123', '99999', '102', 'ABCD', 'CH-5224 XY'];
        for (i in invalidSamples) {
            this.fv.resetForm();
            this.$zipCode.val(invalidSamples[i]);
            this.fv.validate();
            expect(this.fv.isValid()).toEqual(false);
        }
    });

    it('Spain postal code', function() {
        this.fv.updateOption('zc', 'zipCode', 'country', 'ES');

        // Valid samples
        var validSamples = ['01234', '28080', '29004', '41023'];
        for (var i in validSamples) {
            this.fv.resetForm();
            this.$zipCode.val(validSamples[i]);
            this.fv.validate();
            expect(this.fv.isValid()).toBeTruthy();
        }

        // Invalid samples
        var invalidSamples = ['0123', '99999', '102', 'ABCD', '00000'];
        for (i in invalidSamples) {
            this.fv.resetForm();
            this.$zipCode.val(invalidSamples[i]);
            this.fv.validate();
            expect(this.fv.isValid()).toEqual(false);
        }
    });
});
