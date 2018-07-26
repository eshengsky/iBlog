describe('phone', function() {
    beforeEach(function() {
        $([
            '<form class="form-horizontal" id="phoneForm">',
                '<div class="form-group">',
                    '<select class="form-control" name="country">',
                        '<option value="AE">United Arab Emirates</option>',
                        '<option value="BG">Bulgaria</option>',
                        '<option value="BR">Brazil</option>',
                        '<option value="CN">China</option>',
                        '<option value="CZ">Czech Republic</option>',
                        '<option value="DE">Germany</option>',
                        '<option value="DK">Denmark</option>',
                        '<option value="ES">Spain</option>',
                        '<option value="FR">France</option>',
                        '<option value="GB">United Kingdom</option>',
                        '<option value="IN">India</option>',
                        '<option value="MA">Morocco</option>',
                        '<option value="NL">Netherlands</option>',
                        '<option value="PK">Pakistan</option>',
                        '<option value="RO">Romania</option>',
                        '<option value="RU">Russia</option>',
                        '<option value="SK">Slovakia</option>',
                        '<option value="TH">Thailand</option>',
                        '<option value="US">USA</option>',
                        '<option value="VE">Venezuela</option>',
                    '</select>',
                '</div>',
                '<div class="form-group">',
                    '<input type="text" name="phone" data-fv-phone />',
                '</div>',
            '</form>',
        ].join('\n')).appendTo('body');

        $('#phoneForm').formValidation();

        /**
         * @type {FormValidation.Base}
         */
        this.fv       = $('#phoneForm').data('formValidation');
        this.$country = this.fv.getFieldElements('country');
        this.$phone   = this.fv.getFieldElements('phone');
    });

    afterEach(function() {
        $('#phoneForm').formValidation('destroy').remove();
    });

    it('dynamic country', function() {
        this.$phone.attr('data-fv-phone-country', 'country');
        this.fv.destroy();
        this.fv = $('#phoneForm').formValidation().data('formValidation');

        this.$country.val('BR');
        this.$phone.val('16920894635');
        this.fv.validate();
        expect(this.fv.isValid()).toBeTruthy();

        this.fv.resetForm();
        this.$country.val('FR');
        this.$phone.val('0644444444');
        this.fv.validate();
        expect(this.fv.isValid()).toBeTruthy();

        this.fv.resetForm();
        this.$country.val('GB');
        this.$phone.val('012345678900');
        this.fv.validate();
        expect(this.fv.isValid()).toBeFalsy();
    });

    it('United Arab Emirates phone number', function() {
        this.fv.updateOption('phone', 'phone', 'country', 'AE');

        // Valid samples
        var validSamples = [
            '00971501234567',
            '+971521234567',
            '971551234567',
            '971 56 123 4567',
            '971-50-123-4567',
            '971.4.123.4567',
            '+971 (0) 4 1234567',
            '971 (56) 1234567',
            '0551234567',
            '021234567',
            '600-540-000'
        ];
        for (var i in validSamples) {
            this.fv.resetForm();
            this.$phone.val(validSamples[i]);
            this.fv.validate();
            expect(this.fv.isValid()).toBeTruthy();
        }
    });

    it('Bulgaria phone number', function() {
        this.fv.updateOption('phone', 'phone', 'country', 'BG');

        // Valid samples
        var validSamples = [
            '359895123456', '0898111222', '0886111222', '0875111222', '0899555555', '359898111222',
            // double 0
            '00898111222',
            // + and without + at the beginning
            '+35998111222', '098111222',
            '090012900',
            '070010007', '070043256', '35970045045', '35970045666',
            '08000700', '080088001', '080015333',
            '028700000', '030100000', '03010070', '03656745'
        ];
        for (var i in validSamples) {
            this.fv.resetForm();
            this.$phone.val(validSamples[i]);
            this.fv.validate();
            expect(this.fv.isValid()).toBeTruthy();
        }

        // Invalid samples
        var invalidSamples = [
            '01211212'
        ];
        for (i in invalidSamples) {
            this.fv.resetForm();
            this.$phone.val(invalidSamples[i]);
            this.fv.validate();
            expect(this.fv.isValid()).toEqual(false);
        }
    });

    it('Brazil phone number', function() {
        this.fv.updateOption('phone', 'phone', 'country', 'BR');

        // Valid samples
        var validSamples = [
            '0800.000.00.00', '0800-000-00-00', '0800 000 00 00', '0800-00-00-00', '0800.00.00.00', '0800 00 00 00',
            '0800-000-0000', '0800 000 0000', '0800.000.0000', '08000000000',
            '1692089-4635', '16920894635', '16992089-4635', '16 99202-4635', '(16)99202-4635', '(16)92089-4635',
            '(16) 92089-4635', '(15) 4343-4343', '+55 15 3702-7523', '(+55) 15 3702-7523', '(+55)1537027523',
            '(+55)(15)3702-7523', '(+55) 15 3702-7523', '(+55) 15 99202-7523', '99202-4635', '(16) 9208-4635'
        ];
        for (var i in validSamples) {
            this.fv.resetForm();
            this.$phone.val(validSamples[i]);
            this.fv.validate();
            expect(this.fv.isValid()).toBeTruthy();
        }
    });

    it('China phone number', function() {
        this.fv.updateOption('phone', 'phone', 'country', 'CN');

        // Valid samples
        var validSamples = [
            '18911111111', '189 1111 1111', '189-1111-1111', '0086-18911111111', '+86-18911111111',
            '86-18911111111', '0086 18911111111', '+86 18911111111', '86 18911111111', '0086 189-1111-1111',
            '+86 189-1111-1111', '86 189-1111-1111', '02011111111', '020-11111111', '020 11111111',
            '020 1111 1111', '020-1111-1111', '0086 020 82803159', '0086-020-82803159', '0086-020-82803159',
            '+86 20 61302222-8866', '+86 20 6130-2222-8866', '+86 10 59081185'
        ];
        for (var i in validSamples) {
            this.fv.resetForm();
            this.$phone.val(validSamples[i]);
            this.fv.validate();
            expect(this.fv.isValid()).toBeTruthy();
        }
    });

    it('Czech Republic phone number', function() {
        this.fv.updateOption('phone', 'phone', 'country', 'CZ');

        // Valid samples
        var validSamples = [
            '00420123456789', '00420 123456789', '00420 123 456 789', '00 420 123 456 789',
            '+420123456789', '+420 123456789', '+420 123 456 789', '123456789', '123 456 789'
        ];
        for (var i in validSamples) {
            this.fv.resetForm();
            this.$phone.val(validSamples[i]);
            this.fv.validate();
            expect(this.fv.isValid()).toBeTruthy();
        }

        // Invalid samples
        var invalidSamples = [
            '420123456789', '420 123456789', '420 123 456 789', '00421123456789', '00421 123456789',
            '00421 123 456 789', '00 421 123 456 789', '+421123456789', '+421 123456789',
            '+421 123 456 789'
        ];
        for (i in invalidSamples) {
            this.fv.resetForm();
            this.$phone.val(invalidSamples[i]);
            this.fv.validate();
            expect(this.fv.isValid()).toEqual(false);
        }
    });

    it('France phone number', function() {
        this.fv.updateOption('phone', 'phone', 'country', 'FR');

        // Valid samples
        var validSamples = [
            // National formats
            '0644444444', '06 44 44 44 44', '06-44-44-44-44', '06.44.44.44.44',
            // International formats
            '+33644444444', '+336.44.44.44.44', '+33 6.44.44.44.44', '0033644444444', '00336.44.44.44.44',
            '0033 6.44.44.44.44',
            // Some times
            '+33(0)644444444', '+33 (0) 644444444'
        ];
        for (var i in validSamples) {
            this.fv.resetForm();
            this.$phone.val(validSamples[i]);
            this.fv.validate();
            expect(this.fv.isValid()).toBeTruthy();
        }

        // Invalid samples
        var invalidSamples = [
            // The separator between pairs of digits is not the same
            '06 44.44-44.44', '06 44 44-44.44', '06 44 44-4444', '06 44 44-4444',
            // Too many digits
            '06444444444444',
            // Missing leading 0
            '6644444444',
            // Too much non-numeric characters
            '06  44.44-44.44', '+33 (0)  644444444',
            // Bad parenthesis
            '(0)644444444',
            // Bad separator after the international prefix
            '+33-(0)-644444444', '+33 (0)-644444444', '+33-(0) 644444444',
            // Trailing separator
            '06.44.44.44.44.'
        ];
        for (i in invalidSamples) {
            this.fv.resetForm();
            this.$phone.val(invalidSamples[i]);
            this.fv.validate();
            expect(this.fv.isValid()).toEqual(false);
        }
    });

    it('Germany phone number', function() {
        this.fv.updateOption('phone', 'phone', 'country', 'DE');

        // Valid samples
        var validSamples = ['+49(89)123456', '089-1234567', '0891234567', '0049-89-123456', '089 123456-78'];
        for (var i in validSamples) {
            this.fv.resetForm();
            this.$phone.val(validSamples[i]);
            this.fv.validate();
            expect(this.fv.isValid()).toBeTruthy();
        }
    });

    it('India phone number', function() {
        this.fv.updateOption('phone', 'phone', 'country', 'IN');

        // Valid samples
        var validSamples = [
            '9999114011', '+919911112341', '+91 9415007327', '03598245785', '+911204312280', '1302231221'
        ];
        for (var i in validSamples) {
            this.fv.resetForm();
            this.$phone.val(validSamples[i]);
            this.fv.validate();
            expect(this.fv.isValid()).toBeTruthy();
        }
    });
    
    it('United Kingdom phone number', function() {
        this.fv.updateOption('phone', 'phone', 'country', 'GB');

        // Valid samples
        var validSamples = [
            // National formats
            '01611234567', '0161 123 4567', '(0161) 123 4567', '0161-123-4567',
            // International formats
            '+44 161 123 4567', '+441611234567', '+44(0)161234567', '00 44 161 1234567', '(011) 44 161 234567', '0161-158-5587',
            // Extensions
            '0161 123 4567 ext. 123', '01611234567x123', '+44161234567x123', '+44 (0) 161 1234567 ext 123'
        ];
        for (var i in validSamples) {
            this.fv.resetForm();
            this.$phone.val(validSamples[i]);
            this.fv.validate();
            expect(this.fv.isValid()).toBeTruthy();
        }

        // Invalid samples
        var invalidSamples = [
            '012345678900', // Too many digits
            '1611234567',   // Missing trunk
            '012345678',    // Not enough digits
            '123 4567',     // Missing area code
            '061 123 4567'  // Invalid area code
        ];
        for (i in invalidSamples) {
            this.fv.resetForm();
            this.$phone.val(invalidSamples[i]);
            this.fv.validate();
            expect(this.fv.isValid()).toEqual(false);
        }
    });

    it('Morocco phone number', function() {
        this.fv.updateOption('phone', 'phone', 'country', 'MA');

        // Valid samples
        var validSamples = [
            // National formats
            '0644444444', '0610245896', '0630548564', '06 44 44 44 44', '06-44-44-44-44', '06.44.44.44.44', '06 44.44-44.44',
            '0528254856', '0535484541', '05 28 44 44 44', '05-28-44.44.44', '05.28.44.44.44', '05 28.44-44.44',
            // International formats
            '+212644444444', '+2126.44.44.44.44', '+212 6.44.44.44.44', '00212644444444', '002126.44.44.44.44', '00212 6.44.44.44.44',
            // Some times
            '+212(0)644444444', '+212 (0) 644444444'
        ];
        for (var i in validSamples) {
            this.fv.resetForm();
            this.$phone.val(validSamples[i]);
            this.fv.validate();
            expect(this.fv.isValid()).toBeTruthy();
        }

        // Invalid samples
        var invalidSamples = [
            '0625468961', '0512548632', '0542564896',   // Not a valid phone numbers
            '06444444444444',                           // Too many digits
            '6644444444',                               // Missing leading 0
            '06  44.44-44.44', '+212 (0)  644444444',   // Too much non-numeric characters
            '(0)644444444'                              // Bad parenthesis
        ];
        for (i in invalidSamples) {
            this.fv.resetForm();
            this.$phone.val(invalidSamples[i]);
            this.fv.validate();
            expect(this.fv.isValid()).toEqual(false);
        }
    });

    it('Netherlands phone number', function() {
        this.fv.updateOption('phone', 'phone', 'country', 'NL');

        // Valid samples
        var validSamples = [
            // Popular formats
            '0101234567',
            '010-1234567',
            '010 - 123 45 67',
            '010 1234 567',
            '06-12345678',
            '06 123 456 78',
            '0111-123456',
            '0111 123456',

            // International notation
            '+31101234567',
            '0031101234567',
            '+31(0) 10123 4567',
            '+3110-1234567',
            '003110 1234567',
            '+316 123 456 78',
            '+31(0)6 123 45678',
            '+31111-123456',
            '0031111-123456'
        ];
        for (var i in validSamples) {
            this.fv.resetForm();
            this.$phone.val(validSamples[i]);
            this.fv.validate();
            expect(this.fv.isValid()).toBeTruthy();
        }

        // Invalid samples
        var invalidSamples = [
            '06-1234-5678',         // An extra dash is not allowed
            '06 123456789',         // Too long
            '06 1234567',           // Too short
            '+31(06) 123 45678',    // Invalid optional declaration
            '1234567'               // Without regional number
        ];
        for (i in invalidSamples) {
            this.fv.resetForm();
            this.$phone.val(invalidSamples[i]);
            this.fv.validate();
            expect(this.fv.isValid()).toEqual(false);
        }
    });

    it('Pakistan phone number', function() {
        this.fv.updateOption('phone', 'phone', 'country', 'PK');

        // Valid samples
        var validSamples = ['03336527366'];
        for (var i in validSamples) {
            this.fv.resetForm();
            this.$phone.val(validSamples[i]);
            this.fv.validate();
            expect(this.fv.isValid()).toBeTruthy();
        }
    });

    it('Romania phone number', function() {
        this.fv.updateOption('phone', 'phone', 'country', 'RO');

        // Valid samples
        var validSamples = [
            '+40213-564-864', '+40213.564.864', '+40213 564 864', '0213-564-864',
            '0213564864', '0313564864',
            '0720512346', '0730512346', '0740512346', '0750512346', '+40750512346', '+40750.512.346',
            '0760512346', '0770512346', '0780512346'
        ];
        for (var i in validSamples) {
            this.fv.resetForm();
            this.$phone.val(validSamples[i]);
            this.fv.validate();
            expect(this.fv.isValid()).toBeTruthy();
        }

        // Invalid samples
        var invalidSamples = [
            '0213/564/864', // Invalid separator
            '0413564864',   // Invalid land line number (The valid one should be +402, +403 or inside country 02 - 03)
            '0790512346'    // Invalid mobile phone number (The valid one is 072xxxxxxx - 078xxxxxxx)
        ];
        for (i in invalidSamples) {
            this.fv.resetForm();
            this.$phone.val(invalidSamples[i]);
            this.fv.validate();
            expect(this.fv.isValid()).toEqual(false);
        }
    });

    it('Russia phone number', function() {
        this.fv.updateOption('phone', 'phone', 'country', 'RU');

        // Valid samples
        var validSamples = ['+7(911)976-91-04'];
        for (var i in validSamples) {
            this.fv.resetForm();
            this.$phone.val(validSamples[i]);
            this.fv.validate();
            expect(this.fv.isValid()).toBeTruthy();
        }
    });

    it('Slovakia phone number', function() {
        this.fv.updateOption('phone', 'phone', 'country', 'SK');

        // Valid samples
        var validSamples = [
            '00421123456789', '00421 123456789', '00421 123 456 789', '00 421 123 456 789',
            '+421123456789', '+421 123456789', '+421 123 456 789', '123456789', '123 456 789'
        ];
        for (var i in validSamples) {
            this.fv.resetForm();
            this.$phone.val(validSamples[i]);
            this.fv.validate();
            expect(this.fv.isValid()).toBeTruthy();
        }

        // Invalid samples
        var invalidSamples = [
            '421123456789', '421 123456789', '421 123 456 789', '00420123456789', '00420 123456789',
            '00420 123 456 789', '00 420 123 456 789', '+420123456789', '+420 123456789', '+420 123 456 789'
        ];
        for (i in invalidSamples) {
            this.fv.resetForm();
            this.$phone.val(invalidSamples[i]);
            this.fv.validate();
            expect(this.fv.isValid()).toEqual(false);
        }
    });

    it('Spanish phone number', function() {
        this.fv.updateOption('phone', 'phone', 'country', 'ES');

        // Valid samples
        var validSamples = [
            // Landline numbers
            '912345678',
            // Special prefixes
            '900900900', '902902902',
            // Mobile numbers
            '611222333', '744555666',
            // VoIP lines
            '538564738',
            // Premium-rate services
            '806396847',

            // International versions
            '0034912345678', '0034900900900',
            '0034902902902', '0034611222333',
            '0034744555666', '0034538564738',
            '0034806396847',
            '+34912345678', '+34900900900',
            '+34902902902', '+34611222333',
            '+34744555666', '+34538564738',
            '+34806396847'
        ];
        for (var i in validSamples) {
            this.fv.resetForm();
            this.$phone.val(validSamples[i]);
            this.fv.validate();
            expect(this.fv.isValid()).toBeTruthy();
        }

        // Invalid samples
        var invalidSamples = [
            '472849284',    // Invalid prefix
            '938191230420', // Too many digits
            '938191',       // Too few digits
            '00952345754',  // Lacks international prefix
            '+745295738'    // Lacks international prefix
        ];
        for (i in invalidSamples) {
            this.fv.resetForm();
            this.$phone.val(invalidSamples[i]);
            this.fv.validate();
            expect(this.fv.isValid()).toEqual(false);
        }
    });

    it('US phone number', function() {
        this.fv.updateOption('phone', 'phone', 'country', 'US');

        // Valid samples
        var validSamples = [
            '1444-555-1234', '246.555.8888', '1235554567', '(123)456-7890', '123)456.0987', '1-444-555-1234',
            '14325678901', '1(123)456-7890', '+1 246.555-8888', '+1 (123)456-7890', '+1(123)456-7890'
        ];
        for (var i in validSamples) {
            this.fv.resetForm();
            this.$phone.val(validSamples[i]);
            this.fv.validate();
            expect(this.fv.isValid()).toBeTruthy();
        }

        // Invalid samples
        var invalidSamples = [
            '7334-12.111', 'v123.11.1111', '(23)440.4448', '123(456)7890', '0800 333333 abcdef'
        ];
        for (i in invalidSamples) {
            this.fv.resetForm();
            this.$phone.val(invalidSamples[i]);
            this.fv.validate();
            expect(this.fv.isValid()).toEqual(false);
        }
    });
});
