describe('vat', function() {
    beforeEach(function() {
        $([
            '<form class="form-horizontal" id="vatForm">',
                '<div class="form-group">',
                    '<select class="form-control" name="country">',
                        '<option value="AT">Austria</option>',
                        '<option value="BE">Belgium</option>',
                        '<option value="BG">Bulgaria</option>',
                        '<option value="HR">Croatia</option>',
                        '<option value="CY">Cyprus</option>',
                        '<option value="CZ">Czech Republic</option>',
                        '<option value="DK">Denmark</option>',
                        '<option value="EE">Estonia</option>',
                        '<option value="FI">Finland</option>',
                        '<option value="FR">France</option>',
                        '<option value="DE">Germany</option>',
                        '<option value="GR">Greece</option>',
                        '<option value="HU">Hungary</option>',
                        '<option value="IE">Ireland</option>',
                        '<option value="IS">Iceland</option>',
                        '<option value="IT">Italy</option>',
                        '<option value="LV">Latvia</option>',
                        '<option value="LT">Lithuania</option>',
                        '<option value="LU">Luxembourg</option>',
                        '<option value="MT">Malta</option>',
                        '<option value="NL">Netherlands</option>',
                        '<option value="NO">Norway</option>',
                        '<option value="PL">Poland</option>',
                        '<option value="PT">Portugal</option>',
                        '<option value="RO">Romania</option>',
                        '<option value="RU">Russia</option>',
                        '<option value="RS">Serbia</option>',
                        '<option value="SK">Slovakia</option>',
                        '<option value="SI">Slovenia</option>',
                        '<option value="ES">Spain</option>',
                        '<option value="SE">Sweden</option>',
                        '<option value="CH">Switzerland</option>',
                        '<option value="GB">United Kingdom</option>',
                        '<option value="VE">Venezuela</option>',
                        '<option value="ZA">South Africa</option>',
                    '</select>',
                '</div>',
                '<div class="form-group">',
                    '<input type="text" name="vat" data-fv-vat />',
                '</div>',
            '</form>',
        ].join('\n')).appendTo('body');

        $('#vatForm').formValidation();

        /**
         * @type {BootstrapValidator}
         */
        this.fv       = $('#vatForm').data('formValidation');
        this.$country = this.fv.getFieldElements('country');
        this.$vat     = this.fv.getFieldElements('vat');
    });

    afterEach(function() {
        $('#vatForm').formValidation('destroy').remove();
    });

    it('dynamic country', function() {
        this.$vat.attr('data-fv-vat-country', 'country');
        this.fv.destroy();
        this.fv = $('#vatForm').formValidation().data('formValidation');

        this.$country.val('AT');
        this.$vat.val('ATU13585627');
        this.fv.validate();
        expect(this.fv.isValid()).toBeTruthy();

        this.fv.resetForm();
        this.$country.val('BG');
        this.$vat.val('BE0428759497');
        this.fv.validate();
        expect(this.fv.isValid()).toEqual(false);

        this.fv.resetForm();
        this.$country.val('BE');
        this.$vat.val('BE431150351');
        this.fv.validate();
        expect(this.fv.isValid()).toEqual(false);
    });

    it('Austrian VAT number', function() {
        this.fv.updateOption('vat', 'vat', 'country', 'AT');

        // Valid samples
        var validSamples = ['ATU13585627', 'U13585627'];
        for (var i in validSamples) {
            this.fv.resetForm();
            this.$vat.val(validSamples[i]);
            this.fv.validate();
            expect(this.fv.isValid()).toBeTruthy();
        }

        // Invalid samples
        var invalidSamples = ['ATU13585626', 'U13585626'];
        for (i in invalidSamples) {
            this.fv.resetForm();
            this.$vat.val(invalidSamples[i]);
            this.fv.validate();
            expect(this.fv.isValid()).toEqual(false);
        }
    });

    it('Belgian VAT number', function() {
        this.fv.updateOption('vat', 'vat', 'country', 'BE');

        // Valid samples
        var validSamples = ['BE0428759497', '0428759497'];
        for (var i in validSamples) {
            this.fv.resetForm();
            this.$vat.val(validSamples[i]);
            this.fv.validate();
            expect(this.fv.isValid()).toBeTruthy();
        }

        // Invalid samples
        var invalidSamples = ['BE431150351', '431150351'];
        for (i in invalidSamples) {
            this.fv.resetForm();
            this.$vat.val(invalidSamples[i]);
            this.fv.validate();
            expect(this.fv.isValid()).toEqual(false);
        }
    });

    it('Bulgarian VAT number', function() {
        this.fv.updateOption('vat', 'vat', 'country', 'BG');

        // Valid samples
        var validSamples = ['BG175074752', 'BG7523169263', 'BG8032056031', 'BG7542011030', 'BG7111042925', '175074752', '7523169263', '8032056031'];
        for (var i in validSamples) {
            this.fv.resetForm();
            this.$vat.val(validSamples[i]);
            this.fv.validate();
            expect(this.fv.isValid()).toBeTruthy();
        }

        // Invalid samples
        var invalidSamples = ['BG175074753', 'BG7552A10004', 'BG7111042922', '175074753', '7552A10004'];
        for (i in invalidSamples) {
            this.fv.resetForm();
            this.$vat.val(invalidSamples[i]);
            this.fv.validate();
            expect(this.fv.isValid()).toEqual(false);
        }
    });

    it('Cypriot VAT number', function() {
        this.fv.updateOption('vat', 'vat', 'country', 'CY');

        // Valid samples
        var validSamples = ['CY10259033P', '10259033P'];
        for (var i in validSamples) {
            this.fv.resetForm();
            this.$vat.val(validSamples[i]);
            this.fv.validate();
            expect(this.fv.isValid()).toBeTruthy();
        }

        // Invalid samples
        var invalidSamples = ['CY10259033Z', '10259033Z'];
        for (i in invalidSamples) {
            this.fv.resetForm();
            this.$vat.val(invalidSamples[i]);
            this.fv.validate();
            expect(this.fv.isValid()).toEqual(false);
        }
    });

    it('Czech Republic VAT number', function() {
        this.fv.updateOption('vat', 'vat', 'country', 'CZ');

        // Valid samples
        var validSamples = ['CZ25123891', 'CZ7103192745', 'CZ991231123', 'CZ640903926', '25123891', '7103192745'];
        for (var i in validSamples) {
            this.fv.resetForm();
            this.$vat.val(validSamples[i]);
            this.fv.validate();
            expect(this.fv.isValid()).toBeTruthy();
        }

        // Invalid samples
        var invalidSamples = ['CZ25123890', 'CZ1103492745', 'CZ590312123', '25123890', '1103492745'];
        for (i in invalidSamples) {
            this.fv.resetForm();
            this.$vat.val(invalidSamples[i]);
            this.fv.validate();
            expect(this.fv.isValid()).toEqual(false);
        }
    });

    it('German VAT number', function() {
        this.fv.updateOption('vat', 'vat', 'country', 'DE');

        // Valid samples
        var validSamples = ['DE136695976', '136695976'];
        for (var i in validSamples) {
            this.fv.resetForm();
            this.$vat.val(validSamples[i]);
            this.fv.validate();
            expect(this.fv.isValid()).toBeTruthy();
        }

        // Invalid samples
        var invalidSamples = ['DE136695978', '136695978'];
        for (i in invalidSamples) {
            this.fv.resetForm();
            this.$vat.val(invalidSamples[i]);
            this.fv.validate();
            expect(this.fv.isValid()).toEqual(false);
        }
    });

    it('Danish VAT number', function() {
        this.fv.updateOption('vat', 'vat', 'country', 'DK');

        // Valid samples
        var validSamples = ['DK13585628', '13585628'];
        for (var i in validSamples) {
            this.fv.resetForm();
            this.$vat.val(validSamples[i]);
            this.fv.validate();
            expect(this.fv.isValid()).toBeTruthy();
        }

        // Invalid samples
        var invalidSamples = ['DK13585627', '13585627'];
        for (i in invalidSamples) {
            this.fv.resetForm();
            this.$vat.val(invalidSamples[i]);
            this.fv.validate();
            expect(this.fv.isValid()).toEqual(false);
        }
    });

    it('Estonian VAT number', function() {
        this.fv.updateOption('vat', 'vat', 'country', 'EE');

        // Valid samples
        var validSamples = ['EE100931558', 'EE100594102', '100931558', '100594102'];
        for (var i in validSamples) {
            this.fv.resetForm();
            this.$vat.val(validSamples[i]);
            this.fv.validate();
            expect(this.fv.isValid()).toBeTruthy();
        }

        // Invalid samples
        var invalidSamples = ['EE100594103', '100594103'];
        for (i in invalidSamples) {
            this.fv.resetForm();
            this.$vat.val(invalidSamples[i]);
            this.fv.validate();
            expect(this.fv.isValid()).toEqual(false);
        }
    });

    it('Spanish VAT number (NIF)', function() {
        this.fv.updateOption('vat', 'vat', 'country', 'ES');

        // Valid samples
        var validSamples = [
            'ES54362315K', 'ESX2482300W', 'ESX5253868R', 'ESM1234567L', 'ESJ99216582', 'ESB58378431',
            'ESB64717838', '54362315K', 'X2482300W', 'X5253868R', 'M1234567L', 'J99216582',
            'ESR5000274J', 'ESQ5000274J', 'ESB78640570', 'ES50222711A'
        ];
        for (var i in validSamples) {
            this.fv.resetForm();
            this.$vat.val(validSamples[i]);
            this.fv.validate();
            expect(this.fv.isValid()).toBeTruthy();
        }

        // Invalid samples
        var invalidSamples = ['ES54362315Z', 'ESX2482300A', 'ESJ99216583', '54362315Z', 'X2482300A'];
        for (i in invalidSamples) {
            this.fv.resetForm();
            this.$vat.val(invalidSamples[i]);
            this.fv.validate();
            expect(this.fv.isValid()).toEqual(false);
        }
    });

    it('Finnish VAT number', function() {
        this.fv.updateOption('vat', 'vat', 'country', 'FI');

        // Valid samples
        var validSamples = ['FI20774740', '20774740'];
        for (var i in validSamples) {
            this.fv.resetForm();
            this.$vat.val(validSamples[i]);
            this.fv.validate();
            expect(this.fv.isValid()).toBeTruthy();
        }

        // Invalid samples
        var invalidSamples = ['FI20774741', '20774741'];
        for (i in invalidSamples) {
            this.fv.resetForm();
            this.$vat.val(invalidSamples[i]);
            this.fv.validate();
            expect(this.fv.isValid()).toEqual(false);
        }
    });

    it('French VAT number (TVA)', function() {
        this.fv.updateOption('vat', 'vat', 'country', 'FR');

        // Valid samples
        var validSamples = ['FR40303265045', 'FR23334175221', 'FRK7399859412', 'FR4Z123456782', '40303265045', '23334175221', 'K7399859412'];
        for (var i in validSamples) {
            this.fv.resetForm();
            this.$vat.val(validSamples[i]);
            this.fv.validate();
            expect(this.fv.isValid()).toBeTruthy();
        }

        // Invalid samples
        var invalidSamples = ['FR84323140391', '84323140391'];
        for (i in invalidSamples) {
            this.fv.resetForm();
            this.$vat.val(invalidSamples[i]);
            this.fv.validate();
            expect(this.fv.isValid()).toEqual(false);
        }
    });

    it('United Kingdom VAT number', function() {
        this.fv.updateOption('vat', 'vat', 'country', 'GB');

        // Valid samples
        var validSamples = ['GB980780684', '980780684'];
        for (var i in validSamples) {
            this.fv.resetForm();
            this.$vat.val(validSamples[i]);
            this.fv.validate();
            expect(this.fv.isValid()).toBeTruthy();
        }

        // Invalid samples
        var invalidSamples = ['GB802311781', '802311781'];
        for (i in invalidSamples) {
            this.fv.resetForm();
            this.$vat.val(invalidSamples[i]);
            this.fv.validate();
            expect(this.fv.isValid()).toEqual(false);
        }
    });

    it('Greek VAT number', function() {
        this.fv.updateOption('vat', 'vat', 'country', 'GR');

        // Valid samples
        var validSamples = ['GR023456780', 'EL094259216', '023456780', '094259216'];
        for (var i in validSamples) {
            this.fv.resetForm();
            this.$vat.val(validSamples[i]);
            this.fv.validate();
            expect(this.fv.isValid()).toBeTruthy();
        }

        // Invalid samples
        var invalidSamples = ['GR123456781', '123456781'];
        for (i in invalidSamples) {
            this.fv.resetForm();
            this.$vat.val(invalidSamples[i]);
            this.fv.validate();
            expect(this.fv.isValid()).toEqual(false);
        }
    });

    it('Hungarian VAT number', function() {
        this.fv.updateOption('vat', 'vat', 'country', 'HU');

        // Valid samples
        var validSamples = ['HU12892312', '12892312'];
        for (var i in validSamples) {
            this.fv.resetForm();
            this.$vat.val(validSamples[i]);
            this.fv.validate();
            expect(this.fv.isValid()).toBeTruthy();
        }

        // Invalid samples
        var invalidSamples = ['HU12892313', '12892313'];
        for (i in invalidSamples) {
            this.fv.resetForm();
            this.$vat.val(invalidSamples[i]);
            this.fv.validate();
            expect(this.fv.isValid()).toEqual(false);
        }
    });

    it('Croatian VAT number', function() {
        this.fv.updateOption('vat', 'vat', 'country', 'HR');

        // Valid samples
        var validSamples = ['HR33392005961', '33392005961'];
        for (var i in validSamples) {
            this.fv.resetForm();
            this.$vat.val(validSamples[i]);
            this.fv.validate();
            expect(this.fv.isValid()).toBeTruthy();
        }

        // Invalid samples
        var invalidSamples = ['HR33392005962', '33392005962'];
        for (i in invalidSamples) {
            this.fv.resetForm();
            this.$vat.val(invalidSamples[i]);
            this.fv.validate();
            expect(this.fv.isValid()).toEqual(false);
        }
    });

    it('Irish VAT number', function() {
        this.fv.updateOption('vat', 'vat', 'country', 'IE');

        // Valid samples
        var validSamples = ['IE6433435F', 'IE6433435OA', 'IE8D79739I', '6433435F', '6433435OA', '8D79739I'];
        for (var i in validSamples) {
            this.fv.resetForm();
            this.$vat.val(validSamples[i]);
            this.fv.validate();
            expect(this.fv.isValid()).toBeTruthy();
        }

        // Invalid samples
        var invalidSamples = ['IE8D79738J', '8D79738J'];
        for (i in invalidSamples) {
            this.fv.resetForm();
            this.$vat.val(invalidSamples[i]);
            this.fv.validate();
            expect(this.fv.isValid()).toEqual(false);
        }
    });

    it('Iceland VAT (VSK) number', function() {
        this.fv.updateOption('vat', 'vat', 'country', 'IS');

        // Valid samples
        var validSamples = ['IS11111', 'IS111111', '11111', '111111'];
        for (var i in validSamples) {
            this.fv.resetForm();
            this.$vat.val(validSamples[i]);
            this.fv.validate();
            expect(this.fv.isValid()).toBeTruthy();
        }

        // Invalid samples
        var invalidSamples = ['IS1234567', 'IS123456ABC', '1234567', '123456ABC'];
        for (i in invalidSamples) {
            this.fv.resetForm();
            this.$vat.val(invalidSamples[i]);
            this.fv.validate();
            expect(this.fv.isValid()).toEqual(false);
        }
    });

    it('Italian VAT number', function() {
        this.fv.updateOption('vat', 'vat', 'country', 'IT');

        // Valid samples
        var validSamples = ['IT00743110157', '00743110157'];
        for (var i in validSamples) {
            this.fv.resetForm();
            this.$vat.val(validSamples[i]);
            this.fv.validate();
            expect(this.fv.isValid()).toBeTruthy();
        }

        // Invalid samples
        var invalidSamples = ['IT00743110158', '00743110158'];
        for (i in invalidSamples) {
            this.fv.resetForm();
            this.$vat.val(invalidSamples[i]);
            this.fv.validate();
            expect(this.fv.isValid()).toEqual(false);
        }
    });

    it('Lithuanian VAT number', function() {
        this.fv.updateOption('vat', 'vat', 'country', 'LT');

        // Valid samples
        var validSamples = ['LT119511515', 'LT100001919017', 'LT100004801610', '119511515', '100001919017', '100004801610'];
        for (var i in validSamples) {
            this.fv.resetForm();
            this.$vat.val(validSamples[i]);
            this.fv.validate();
            expect(this.fv.isValid()).toBeTruthy();
        }

        // Invalid samples
        var invalidSamples = ['LT100001919018', '100001919018'];
        for (i in invalidSamples) {
            this.fv.resetForm();
            this.$vat.val(invalidSamples[i]);
            this.fv.validate();
            expect(this.fv.isValid()).toEqual(false);
        }
    });

    it('Luxembourg VAT number', function() {
        this.fv.updateOption('vat', 'vat', 'country', 'LU');

        // Valid samples
        var validSamples = ['LU15027442', '15027442'];
        for (var i in validSamples) {
            this.fv.resetForm();
            this.$vat.val(validSamples[i]);
            this.fv.validate();
            expect(this.fv.isValid()).toBeTruthy();
        }

        // Invalid samples
        var invalidSamples = ['LU15027443', '15027443'];
        for (i in invalidSamples) {
            this.fv.resetForm();
            this.$vat.val(invalidSamples[i]);
            this.fv.validate();
            expect(this.fv.isValid()).toEqual(false);
        }
    });

    it('Latvian VAT number', function() {
        this.fv.updateOption('vat', 'vat', 'country', 'LV');

        // Valid samples
        var validSamples = ['LV40003521600', 'LV16117519997', '40003521600', '16117519997'];
        for (var i in validSamples) {
            this.fv.resetForm();
            this.$vat.val(validSamples[i]);
            this.fv.validate();
            expect(this.fv.isValid()).toBeTruthy();
        }

        // Invalid samples
        var invalidSamples = ['LV40003521601', 'LV16137519997', '40003521601', '16137519997'];
        for (i in invalidSamples) {
            this.fv.resetForm();
            this.$vat.val(invalidSamples[i]);
            this.fv.validate();
            expect(this.fv.isValid()).toEqual(false);
        }
    });

    it('Maltese VAT number', function() {
        this.fv.updateOption('vat', 'vat', 'country', 'MT');

        // Valid samples
        var validSamples = ['MT11679112', '11679112'];
        for (var i in validSamples) {
            this.fv.resetForm();
            this.$vat.val(validSamples[i]);
            this.fv.validate();
            expect(this.fv.isValid()).toBeTruthy();
        }

        // Invalid samples
        var invalidSamples = ['MT11679113', '11679113'];
        for (i in invalidSamples) {
            this.fv.resetForm();
            this.$vat.val(invalidSamples[i]);
            this.fv.validate();
            expect(this.fv.isValid()).toEqual(false);
        }
    });

    it('Dutch VAT number', function() {
        this.fv.updateOption('vat', 'vat', 'country', 'NL');

        // Valid samples
        var validSamples = ['NL004495445B01', '004495445B01'];
        for (var i in validSamples) {
            this.fv.resetForm();
            this.$vat.val(validSamples[i]);
            this.fv.validate();
            expect(this.fv.isValid()).toBeTruthy();
        }

        // Invalid samples
        var invalidSamples = ['NL123456789B90', '123456789B90'];
        for (i in invalidSamples) {
            this.fv.resetForm();
            this.$vat.val(invalidSamples[i]);
            this.fv.validate();
            expect(this.fv.isValid()).toEqual(false);
        }
    });

    it('Polish VAT number', function() {
        this.fv.updateOption('vat', 'vat', 'country', 'PL');

        // Valid samples
        var validSamples = ['PL8567346215', '8567346215'];
        for (var i in validSamples) {
            this.fv.resetForm();
            this.$vat.val(validSamples[i]);
            this.fv.validate();
            expect(this.fv.isValid()).toBeTruthy();
        }

        // Invalid samples
        var invalidSamples = ['PL8567346216', '8567346216'];
        for (i in invalidSamples) {
            this.fv.resetForm();
            this.$vat.val(invalidSamples[i]);
            this.fv.validate();
            expect(this.fv.isValid()).toEqual(false);
        }
    });

    it('Portuguese VAT number', function() {
        this.fv.updateOption('vat', 'vat', 'country', 'PT');

        // Valid samples
        var validSamples = ['PT501964843', '501964843'];
        for (var i in validSamples) {
            this.fv.resetForm();
            this.$vat.val(validSamples[i]);
            this.fv.validate();
            expect(this.fv.isValid()).toBeTruthy();
        }

        // Invalid samples
        var invalidSamples = ['PT501964842', '501964842'];
        for (i in invalidSamples) {
            this.fv.resetForm();
            this.$vat.val(invalidSamples[i]);
            this.fv.validate();
            expect(this.fv.isValid()).toEqual(false);
        }
    });

    it('Romanian VAT number', function() {
        this.fv.updateOption('vat', 'vat', 'country', 'RO');

        // Valid samples
        var validSamples = ['RO18547290', '18547290'];
        for (var i in validSamples) {
            this.fv.resetForm();
            this.$vat.val(validSamples[i]);
            this.fv.validate();
            expect(this.fv.isValid()).toBeTruthy();
        }

        // Invalid samples
        var invalidSamples = ['RO18547291', '18547291'];
        for (i in invalidSamples) {
            this.fv.resetForm();
            this.$vat.val(invalidSamples[i]);
            this.fv.validate();
            expect(this.fv.isValid()).toEqual(false);
        }
    });

    it('Russian VAT number', function() {
        this.fv.updateOption('vat', 'vat', 'country', 'RU');

        // Valid samples
        var validSamples = ['RU7805145876', 'RU781300557475', '7805145876', '781300557475'];
        for (var i in validSamples) {
            this.fv.resetForm();
            this.$vat.val(validSamples[i]);
            this.fv.validate();
            expect(this.fv.isValid()).toBeTruthy();
        }

        // Invalid samples
        var invalidSamples = ['RU7805145877', 'RU781300557474', '7805145877', '781300557474'];
        for (i in invalidSamples) {
            this.fv.resetForm();
            this.$vat.val(invalidSamples[i]);
            this.fv.validate();
            expect(this.fv.isValid()).toEqual(false);
        }
    });

    it('Swedish VAT number', function() {
        this.fv.updateOption('vat', 'vat', 'country', 'SE');

        // Valid samples
        var validSamples = ['SE123456789701', '123456789701'];
        for (var i in validSamples) {
            this.fv.resetForm();
            this.$vat.val(validSamples[i]);
            this.fv.validate();
            expect(this.fv.isValid()).toBeTruthy();
        }

        // Invalid samples
        var invalidSamples = ['SE123456789101', '123456789101'];
        for (i in invalidSamples) {
            this.fv.resetForm();
            this.$vat.val(invalidSamples[i]);
            this.fv.validate();
            expect(this.fv.isValid()).toEqual(false);
        }
    });

    it('Slovenian VAT number', function() {
        this.fv.updateOption('vat', 'vat', 'country', 'SI');

        // Valid samples
        var validSamples = ['SI50223054', '50223054'];
        for (var i in validSamples) {
            this.fv.resetForm();
            this.$vat.val(validSamples[i]);
            this.fv.validate();
            expect(this.fv.isValid()).toBeTruthy();
        }

        // Invalid samples
        var invalidSamples = ['SI50223055', '50223055', 'SI09999990', '09999990'];
        for (i in invalidSamples) {
            this.fv.resetForm();
            this.$vat.val(invalidSamples[i]);
            this.fv.validate();
            expect(this.fv.isValid()).toEqual(false);
        }
    });

    it('Slovak VAT number', function() {
        this.fv.updateOption('vat', 'vat', 'country', 'SK');

        // Valid samples
        var validSamples = ['SK2022749619', '2022749619'];
        for (var i in validSamples) {
            this.fv.resetForm();
            this.$vat.val(validSamples[i]);
            this.fv.validate();
            expect(this.fv.isValid()).toBeTruthy();
        }

        // Invalid samples
        var invalidSamples = ['SK2022749618', '2022749618'];
        for (i in invalidSamples) {
            this.fv.resetForm();
            this.$vat.val(invalidSamples[i]);
            this.fv.validate();
            expect(this.fv.isValid()).toEqual(false);
        }
    });

    it('South African VAT number', function() {
        this.fv.updateOption('vat', 'vat', 'country', 'ZA');

        // Valid samples
        var validSamples = ['ZA4012345678', '4012345678'];
        for (var i in validSamples) {
            this.fv.resetForm();
            this.$vat.val(validSamples[i]);
            this.fv.validate();
            expect(this.fv.isValid()).toBeTruthy();
        }

        // Invalid samples
        var invalidSamples = ['ZA40123456789', 'ZA0123456789', '40123456789', '0123456789'];
        for (i in invalidSamples) {
            this.fv.resetForm();
            this.$vat.val(invalidSamples[i]);
            this.fv.validate();
            expect(this.fv.isValid()).toEqual(false);
        }
    });

    it('Venezuelan VAT number (RIF)', function() {
        this.fv.updateOption('vat', 'vat', 'country', 'VE');

        // Valid samples
        var validSamples = ['VEJ309272292', 'VEV242818101', 'VEJ000126518', 'VEJ000458324', 'J309272292', 'V242818101', 'J000126518', 'J000458324'];
        for (var i in validSamples) {
            this.fv.resetForm();
            this.$vat.val(validSamples[i]);
            this.fv.validate();
            expect(this.fv.isValid()).toBeTruthy();
        }

        // Invalid samples
        var invalidSamples = ['VEJ309272293', 'VEV242818100', 'J000126519', 'J000458323'];
        for (i in invalidSamples) {
            this.fv.resetForm();
            this.$vat.val(invalidSamples[i]);
            this.fv.validate();
            expect(this.fv.isValid()).toEqual(false);
        }
    });
});
