describe('id', function() {
    beforeEach(function() {
        $([
            '<form class="form-horizontal" id="idForm">',
                '<div class="form-group">',
                    '<select class="form-control" name="country">',
                        '<option value="BA">Bosnia and Herzegovina</option>',
                        '<option value="BG">Bulgaria</option>',
                        '<option value="BR">Brazil</option>',
                        '<option value="CH">Switzerland</option>',
                        '<option value="CL">Chile</option>',
                        '<option value="CN">China</option>',
                        '<option value="CZ">Czech</option>',
                        '<option value="DK">Denmark</option>',
                        '<option value="EE">Estonia</option>',
                        '<option value="ES">Spain</option>',
                        '<option value="FI">Finland</option>',
                        '<option value="HR">Croatia</option>',
                        '<option value="IE">Ireland</option>',
                        '<option value="IS">Iceland</option>',
                        '<option value="LT">Lithuania</option>',
                        '<option value="LV">Latvia</option>',
                        '<option value="ME">Montenegro</option>',
                        '<option value="MK">Macedonia</option>',
                        '<option value="NL">Netherlands</option>',
                        '<option value="PL">Poland</option>',
                        '<option value="RO">Romania</option>',
                        '<option value="RS">Serbia</option>',
                        '<option value="SE">Sweden</option>',
                        '<option value="SI">Slovenia</option>',
                        '<option value="SK">Slovakia</option>',
                        '<option value="SM">San Marino</option>',
                        '<option value="TH">Thailand</option>',
                        '<option value="ZA">South Africa</option>',
                    '</select>',
                '</div>',
                '<div class="form-group">',
                    '<input class="form-control" type="text" name="id" data-fv-id />',
                '</div>',
            '</form>'
        ].join('\n')).appendTo('body');

        $('#idForm').formValidation();

        /**
         * @type {FormValidation.Base}
         */
        this.fv       = $('#idForm').data('formValidation');
        this.$country = this.fv.getFieldElements('country');
        this.$id      = this.fv.getFieldElements('id');
    });

    afterEach(function() {
        $('#idForm').formValidation('destroy').remove();
    });

    it('dynamic country', function() {
        this.$id.attr('data-fv-id-country', 'country');
        this.fv.destroy();
        this.fv = $('#idForm').formValidation().data('formValidation');

        this.$country.val('BG');
        this.$id.val('7552010005');
        this.fv.validate();
        expect(this.fv.isValid()).toBeTruthy();

        this.fv.resetForm();
        this.$country.val('BR');
        this.$id.val('231.002.999-00');
        this.fv.validate();
        expect(this.fv.isValid()).toEqual(false);
    });

    it('Bulgarian national identification number (EGN)', function() {
        this.fv.updateOption('id', 'id', 'country', 'BG');

        // Valid samples
        var validSamples = ['7523169263', '8032056031', '803205 603 1', '8001010008', '7501020018', '7552010005', '7542011030'];
        for (var i in validSamples) {
            this.fv.resetForm();
            this.$id.val(validSamples[i]);
            this.fv.validate();
            expect(this.fv.isValid()).toBeTruthy();
        }

        // Invalid samples
        var invalidSamples = ['8019010008'];
        for (i in invalidSamples) {
            this.fv.resetForm();
            this.$id.val(invalidSamples[i]);
            this.fv.validate();
            expect(this.fv.isValid()).toEqual(false);
        }
    });

    it('Brazilian national identification number (CPF)', function() {
        this.fv.updateOption('id', 'id', 'country', 'BR');

        // Valid samples
        var validSamples = ['39053344705', '11144477735', '390.533.447-05', '111.444.777-35'];
        for (var i in validSamples) {
            this.fv.resetForm();
            this.$id.val(validSamples[i]);
            this.fv.validate();
            expect(this.fv.isValid()).toBeTruthy();
        }

        // Invalid samples
        var invalidSamples = [
            '39053344705000', '390533447050000', '1114447773500000000',  // support#50
            '231.002.999-00', '000.000.000-00', '111.111.111-11', '23100299900', '00000000000', '11111111111'
        ];
        for (i in invalidSamples) {
            this.fv.resetForm();
            this.$id.val(invalidSamples[i]);
            this.fv.validate();
            expect(this.fv.isValid()).toEqual(false);
        }
    });

    it('Swiss Social Security Number (AHV-Nr/No AVS)', function() {
        this.fv.updateOption('id', 'id', 'country', 'CH');

        // Valid samples
        var validSamples = ['756.1234.5678.95', '7561234567895'];
        for (var i in validSamples) {
            this.fv.resetForm();
            this.$id.val(validSamples[i]);
            this.fv.validate();
            expect(this.fv.isValid()).toBeTruthy();
        }
    });

    it('Chilean national identification number (RUN/RUT)', function() {
        this.fv.updateOption('id', 'id', 'country', 'CL');

        // Valid samples
        var validSamples = ['76086428-5', '22060449-7', '12531909-2','12937893-K','12937893-k'];
        for (var i in validSamples) {
            this.fv.resetForm();
            this.$id.val(validSamples[i]);
            this.fv.validate();
            expect(this.fv.isValid()).toBeTruthy();
        }
    });

    // #793
    it('Chinese citizen identification number', function() {
        this.fv.updateOption('id', 'id', 'country', 'CN');

        // Valid samples
        var validSamples = ['450202201409072332', '22011219930407001X', '110108601017023'];
        for (var i in validSamples) {
            this.fv.resetForm();
            this.$id.val(validSamples[i]);
            this.fv.validate();
            expect(this.fv.isValid()).toBeTruthy();
        }

        // Invalid samples
        var invalidSamples = ['999999199304070016', '220112190002290016', '220112199304070019', '999999601017023', '110108999999023'];
        for (i in invalidSamples) {
            this.fv.resetForm();
            this.$id.val(invalidSamples[i]);
            this.fv.validate();
            expect(this.fv.isValid()).toEqual(false);
        }
    });

    it('Czech national identification number (RC)', function() {
        this.fv.updateOption('id', 'id', 'country', 'CZ');

        // Valid samples
        var validSamples = ['7103192745', '991231123'];
        for (var i in validSamples) {
            this.fv.resetForm();
            this.$id.val(validSamples[i]);
            this.fv.validate();
            expect(this.fv.isValid()).toBeTruthy();
        }

        // Invalid samples
        var invalidSamples = ['1103492745', '590312123'];
        for (i in invalidSamples) {
            this.fv.resetForm();
            this.$id.val(invalidSamples[i]);
            this.fv.validate();
            expect(this.fv.isValid()).toEqual(false);
        }
    });

    it('Danish Personal Identification number (CPR)', function() {
        this.fv.updateOption('id', 'id', 'country', 'DK');

        // Valid samples
        var validSamples = ['2110625629', '211062-5629'];
        for (var i in validSamples) {
            this.fv.resetForm();
            this.$id.val(validSamples[i]);
            this.fv.validate();
            expect(this.fv.isValid()).toBeTruthy();
        }

        // Invalid samples
        var invalidSamples = ['511062-5629'];
        for (i in invalidSamples) {
            this.fv.resetForm();
            this.$id.val(invalidSamples[i]);
            this.fv.validate();
            expect(this.fv.isValid()).toEqual(false);
        }
    });

    it('Estonian Personal Identification Code (isikukood)', function() {
        this.fv.updateOption('id', 'id', 'country', 'EE');

        // Valid samples
        var validSamples = ['37605030299'];
        for (var i in validSamples) {
            this.fv.resetForm();
            this.$id.val(validSamples[i]);
            this.fv.validate();
            expect(this.fv.isValid()).toBeTruthy();
        }
    });

    it('Spanish personal identity code (DNI/NIE/CIF)', function() {
        this.fv.updateOption('id', 'id', 'country', 'ES');

        // Valid samples
        var validSamples = ['54362315K', '54362315-K', 'X2482300W', 'X-2482300W', 'X-2482300-W', 'A58818501', 'A-58818501'];
        for (var i in validSamples) {
            this.fv.resetForm();
            this.$id.val(validSamples[i]);
            this.fv.validate();
            expect(this.fv.isValid()).toBeTruthy();
        }

        // Invalid samples
        var invalidSamples = ['54362315Z', 'X-2482300A', 'A5881850A', 'K58818501', 'G58818507'];
        for (i in invalidSamples) {
            this.fv.resetForm();
            this.$id.val(invalidSamples[i]);
            this.fv.validate();
            expect(this.fv.isValid()).toEqual(false);
        }
    });

    it('Finnish Personal Identity Code (HETU)', function() {
        this.fv.updateOption('id', 'id', 'country', 'FI');

        // Valid samples
        var validSamples = ['311280-888Y', '131052-308T'];
        for (var i in validSamples) {
            this.fv.resetForm();
            this.$id.val(validSamples[i]);
            this.fv.validate();
            expect(this.fv.isValid()).toBeTruthy();
        }

        // Invalid samples
        var invalidSamples = ['131052-308U', '310252-308Y'];
        for (i in invalidSamples) {
            this.fv.resetForm();
            this.$id.val(invalidSamples[i]);
            this.fv.validate();
            expect(this.fv.isValid()).toEqual(false);
        }
    });

    it('Croatian personal identification number (OIB)', function() {
        this.fv.updateOption('id', 'id', 'country', 'HR');

        // Valid samples
        var validSamples = ['33392005961'];
        for (var i in validSamples) {
            this.fv.resetForm();
            this.$id.val(validSamples[i]);
            this.fv.validate();
            expect(this.fv.isValid()).toBeTruthy();
        }

        // Invalid samples
        var invalidSamples = ['33392005962'];
        for (i in invalidSamples) {
            this.fv.resetForm();
            this.$id.val(invalidSamples[i]);
            this.fv.validate();
            expect(this.fv.isValid()).toEqual(false);
        }
    });

    it('Irish Personal Public Service Number (PPS)', function() {
        this.fv.updateOption('id', 'id', 'country', 'IE');

        // Valid samples
        var validSamples = ['6433435F', '6433435FT', '6433435FW', '6433435OA', '6433435IH', '1234567TW', '1234567FA'];
        for (var i in validSamples) {
            this.fv.resetForm();
            this.$id.val(validSamples[i]);
            this.fv.validate();
            expect(this.fv.isValid()).toBeTruthy();
        }

        // Invalid samples
        var invalidSamples = ['6433435E', '6433435VH'];
        for (i in invalidSamples) {
            this.fv.resetForm();
            this.$id.val(invalidSamples[i]);
            this.fv.validate();
            expect(this.fv.isValid()).toEqual(false);
        }
    });

    it('Iceland national identification number (Kennitala)', function() {
        this.fv.updateOption('id', 'id', 'country', 'IS');

        // Valid samples
        var validSamples = ['120174-3399', '1201743399', '0902862349'];
        for (var i in validSamples) {
            this.fv.resetForm();
            this.$id.val(validSamples[i]);
            this.fv.validate();
            expect(this.fv.isValid()).toBeTruthy();
        }
    });

    it('Lithuanian Personal Code (Asmens kodas)', function() {
        this.fv.updateOption('id', 'id', 'country', 'LT');

        // Valid samples
        var validSamples = ['38703181745'];
        for (var i in validSamples) {
            this.fv.resetForm();
            this.$id.val(validSamples[i]);
            this.fv.validate();
            expect(this.fv.isValid()).toBeTruthy();
        }

        // Invalid samples
        var invalidSamples = ['38703181746', '78703181745', '38703421745'];
        for (i in invalidSamples) {
            this.fv.resetForm();
            this.$id.val(invalidSamples[i]);
            this.fv.validate();
            expect(this.fv.isValid()).toEqual(false);
        }
    });

    it('Latvian Personal Code (Personas kods)', function() {
        this.fv.updateOption('id', 'id', 'country', 'LV');

        // Valid samples
        var validSamples = ['161175-19997', '16117519997'];
        for (var i in validSamples) {
            this.fv.resetForm();
            this.$id.val(validSamples[i]);
            this.fv.validate();
            expect(this.fv.isValid()).toBeTruthy();
        }

        // Invalid samples
        var invalidSamples = ['161375-19997'];
        for (i in invalidSamples) {
            this.fv.resetForm();
            this.$id.val(invalidSamples[i]);
            this.fv.validate();
            expect(this.fv.isValid()).toEqual(false);
        }
    });

    it('Dutch national identification number (BSN)', function() {
        this.fv.updateOption('id', 'id', 'country', 'NL');

        // Valid samples
        var validSamples = ['111222333', '941331490', '9413.31.490'];
        for (var i in validSamples) {
            this.fv.resetForm();
            this.$id.val(validSamples[i]);
            this.fv.validate();
            expect(this.fv.isValid()).toBeTruthy();
        }

        // Invalid samples
        var invalidSamples = ['111252333'];
        for (i in invalidSamples) {
            this.fv.resetForm();
            this.$id.val(invalidSamples[i]);
            this.fv.validate();
            expect(this.fv.isValid()).toEqual(false);
        }
    });
    
    it('Polish citizen number (PESEL)', function() {
        this.fv.updateOption('id', 'id', 'country', 'PL');

        // Valid samples
        var validSamples = ['83010411457', '87123116221'];
        for (var i in validSamples) {
            this.fv.resetForm();
            this.$id.val(validSamples[i]);
            this.fv.validate();
            expect(this.fv.isValid()).toBeTruthy();
        }

        // Invalid samples
        var invalidSamples = ['39100413824', '36032806768', '04271113861'];
        for (i in invalidSamples) {
            this.fv.resetForm();
            this.$id.val(invalidSamples[i]);
            this.fv.validate();
            expect(this.fv.isValid()).toEqual(false);
        }
    });

    it('Romanian numerical personal code (CNP)', function() {
        this.fv.updateOption('id', 'id', 'country', 'RO');

        // Valid samples
        var validSamples = ['1630615123457', '1800101221144'];
        for (var i in validSamples) {
            this.fv.resetForm();
            this.$id.val(validSamples[i]);
            this.fv.validate();
            expect(this.fv.isValid()).toBeTruthy();
        }

        // Invalid samples
        var invalidSamples = ['8800101221144', '1632215123457', '1630615123458'];
        for (i in invalidSamples) {
            this.fv.resetForm();
            this.$id.val(invalidSamples[i]);
            this.fv.validate();
            expect(this.fv.isValid()).toEqual(false);
        }
    });

    it('Swedish personal identity number (personnummer)', function() {
        this.fv.updateOption('id', 'id', 'country', 'SE');

        // Valid samples
        var validSamples = ['8112289874', '811228-9874', '811228+9874'];
        for (var i in validSamples) {
            this.fv.resetForm();
            this.$id.val(validSamples[i]);
            this.fv.validate();
            expect(this.fv.isValid()).toBeTruthy();
        }

        // Invalid samples
        var invalidSamples = ['811228-9873'];
        for (i in invalidSamples) {
            this.fv.resetForm();
            this.$id.val(invalidSamples[i]);
            this.fv.validate();
            expect(this.fv.isValid()).toEqual(false);
        }
    });

    it('Slovak national identifier number (RC)', function() {
        this.fv.updateOption('id', 'id', 'country', 'SK');

        // Valid samples
        var validSamples = ['7103192745', '991231123'];
        for (var i in validSamples) {
            this.fv.resetForm();
            this.$id.val(validSamples[i]);
            this.fv.validate();
            expect(this.fv.isValid()).toBeTruthy();
        }

        // Invalid samples
        var invalidSamples = ['7103192746', '1103492745'];
        for (i in invalidSamples) {
            this.fv.resetForm();
            this.$id.val(invalidSamples[i]);
            this.fv.validate();
            expect(this.fv.isValid()).toEqual(false);
        }
    });

    it('South African ID', function() {
        this.fv.updateOption('id', 'id', 'country', 'ZA');

        // Valid samples
        var validSamples = ['8001015009087'];
        for (var i in validSamples) {
            this.fv.resetForm();
            this.$id.val(validSamples[i]);
            this.fv.validate();
            expect(this.fv.isValid()).toBeTruthy();
        }

        // Invalid samples
        var invalidSamples = ['8001015009287', '8001015009086'];
        for (i in invalidSamples) {
            this.fv.resetForm();
            this.$id.val(invalidSamples[i]);
            this.fv.validate();
            expect(this.fv.isValid()).toEqual(false);
        }
    });

    it('Thailand citizen number', function() {
        this.fv.updateOption('id', 'id', 'country', 'TH');

        // Valid samples
        var validSamples = ['7145620509547', '3688699975685', '2368719339716'];
        for (var i in validSamples) {
            this.fv.resetForm();
            this.$id.val(validSamples[i]);
            this.fv.validate();
            expect(this.fv.isValid()).toBeTruthy();
        }

        // Invalid samples
        var invalidSamples = ['1100800092310'];
        for (i in invalidSamples) {
            this.fv.resetForm();
            this.$id.val(invalidSamples[i]);
            this.fv.validate();
            expect(this.fv.isValid()).toEqual(false);
        }
    });
});
