describe('iban', function() {
    beforeEach(function() {
        $([
            '<form class="form-horizontal" id="ibanForm">',
                '<div class="form-group">',
                    '<select class="form-control" name="country">',
                        '<option value="AD">Andorra</option>',
                        '<option value="AE">United Arab Emirates</option>',
                        '<option value="AL">Albania</option>',
                        '<option value="AO">Angola</option>',
                        '<option value="AT">Austria</option>',
                        '<option value="AZ">Azerbaijan</option>',
                        '<option value="BA">Bosnia and Herzegovina</option>',
                        '<option value="BE">Belgium</option>',
                        '<option value="BF">Burkina Faso</option>',
                        '<option value="BG">Bulgaria</option>',
                        '<option value="BH">Bahrain</option>',
                        '<option value="BI">Burundi</option>',
                        '<option value="BJ">Benin</option>',
                        '<option value="BR">Brazil</option>',
                        '<option value="CH">Switzerland</option>',
                        '<option value="CM">Cameroon</option>',
                        '<option value="CR">Costa Rica</option>',
                        '<option value="CV">Cape Verde</option>',
                        '<option value="CY">Cyprus</option>',
                        '<option value="CZ">Czech Republic</option>',
                        '<option value="DE">Germany</option>',
                        '<option value="DK">Denmark</option>',
                        '<option value="DO">Dominican Republic</option>',
                        '<option value="DZ">Algeria</option>',
                        '<option value="EE">Estonia</option>',
                        '<option value="ES">Spain</option>',
                        '<option value="FI">Finland</option>',
                        '<option value="FO">Faroe Islands</option>',
                        '<option value="FR">France</option>',
                        '<option value="GB">United Kingdom</option>',
                        '<option value="GE">Georgia</option>',
                        '<option value="GI">Gibraltar</option>',
                        '<option value="GL">Greenland</option>',
                        '<option value="GR">Greece</option>',
                        '<option value="GT">Guatemala</option>',
                        '<option value="HR">Croatia</option>',
                        '<option value="HU">Hungary</option>',
                        '<option value="IE">Ireland</option>',
                        '<option value="IL">Israel</option>',
                        '<option value="IR">Iran</option>',
                        '<option value="IS">Iceland</option>',
                        '<option value="IT">Italy</option>',
                        '<option value="JO">Jordan</option>',
                        '<option value="KW">Kuwait</option>',
                        '<option value="KZ">Kazakhstan</option>',
                        '<option value="LB">Lebanon</option>',
                        '<option value="LI">Liechtenstein</option>',
                        '<option value="LT">Lithuania</option>',
                        '<option value="LU">Luxembourg</option>',
                        '<option value="LV">Latvia</option>',
                        '<option value="MC">Monaco</option>',
                        '<option value="MD">Moldova</option>',
                        '<option value="ME">Montenegro</option>',
                        '<option value="MG">Madagascar</option>',
                        '<option value="MK">Macedonia</option>',
                        '<option value="ML">Mali</option>',
                        '<option value="MR">Mauritania</option>',
                        '<option value="MT">Malta</option>',
                        '<option value="MU">Mauritius</option>',
                        '<option value="MZ">Mozambique</option>',
                        '<option value="NL">Netherlands</option>',
                        '<option value="NO">Norway</option>',
                        '<option value="PK">Pakistan</option>',
                        '<option value="PL">Poland</option>',
                        '<option value="PS">Palestinian</option>',
                        '<option value="PT">Portugal</option>',
                        '<option value="QA">Qatar</option>',
                        '<option value="RO">Romania</option>',
                        '<option value="RS">Serbia</option>',
                        '<option value="SA">Saudi Arabia</option>',
                        '<option value="SE">Sweden</option>',
                        '<option value="SE">Slovenia</option>',
                        '<option value="SK">Slovakia</option>',
                        '<option value="SM">San Marino</option>',
                        '<option value="SN">Senegal</option>',
                        '<option value="TN">Tunisia</option>',
                        '<option value="TR">Turkey</option>',
                        '<option value="VG">Virgin Islands, British</option>',
                    '</select>',
                '</div>',
                '<div class="form-group">',
                    '<input type="text" name="iban" data-fv-iban />',
                '</div>',
            '</form>'
        ].join('\n')).appendTo('body');

        $('#ibanForm').formValidation();

        this.fv       = $('#ibanForm').data('formValidation');
        this.$country = this.fv.getFieldElements('country');
        this.$iban    = this.fv.getFieldElements('iban');
    });

    afterEach(function() {
        $('#ibanForm').formValidation('destroy').remove();
    });

    it('not supported country', function() {
        this.$iban.val('US123456789');
        this.fv.validate();
        expect(this.fv.isValidField('iban')).toBeTruthy();
    });

    it('dynamic country', function() {
        this.$iban.attr('data-fv-iban-country', 'country');
        this.fv.destroy();
        this.fv = $('#ibanForm').formValidation().data('formValidation');

        this.$country.val('AT');
        this.$iban.val('AT611904300234573201');
        this.fv.validate();
        expect(this.fv.isValid()).toBeTruthy();

        this.fv.resetForm();
        this.$country.val('BG');
        this.$iban.val('HR1210010051863000160');
        this.fv.validate();
        expect(this.fv.isValid()).toEqual(false);
    });

    it('Albania', function() {
        this.$iban.val('AL47212110090000000235698741');
        this.fv.validate();
        expect(this.fv.isValidField('iban')).toBeTruthy();
    });

    it('Algeria', function() {
        this.$iban.val('DZ4000400174401001050486');
        this.fv.validate();
        expect(this.fv.isValidField('iban')).toBeTruthy();
    });

    it('Andorra', function() {
        this.$iban.val('AD1200012030200359100100');
        this.fv.validate();
        expect(this.fv.isValidField('iban')).toBeTruthy();
    });

    it('Angola', function() {
        this.$iban.val('AO06000600000100037131174');
        this.fv.validate();
        expect(this.fv.isValidField('iban')).toBeTruthy();
    });

    it('Austria', function() {
        this.$iban.val('AT611904300234573201');
        this.fv.validate();
        expect(this.fv.isValidField('iban')).toBeTruthy();
    });

    it('Azerbaijan', function() {
        this.$iban.val('AZ21NABZ00000000137010001944');
        this.fv.validate();
        expect(this.fv.isValidField('iban')).toBeTruthy();
    });

    it('Bahrain', function() {
        this.$iban.val('BH29BMAG1299123456BH00');
        this.fv.validate();
        expect(this.fv.isValidField('iban')).toBeTruthy();
    });

    it('Belgium', function() {
        this.$iban.val('BE68539007547034');
        this.fv.validate();
        expect(this.fv.isValidField('iban')).toBeTruthy();
    });

    it('Benin', function() {
        this.$iban.val('BJ11B00610100400271101192591');
        this.fv.validate();
        expect(this.fv.isValidField('iban')).toBeTruthy();
    });

    it('Brazil', function() {
        this.$iban.val('BR9700360305000010009795493P1');
        this.fv.validate();
        expect(this.fv.isValidField('iban')).toBeTruthy();
    });

    it('Bulgaria', function() {
        this.$iban.val('BG80BNBG96611020345678');
        this.fv.validate();
        expect(this.fv.isValidField('iban')).toBeTruthy();
    });

    it('Burkina Faso', function() {
        this.$iban.val('BF1030134020015400945000643');
        this.fv.validate();
        expect(this.fv.isValidField('iban')).toBeTruthy();
    });
    it('Burundi', function() {
        this.$iban.val('BI43201011067444');
        this.fv.validate();
        expect(this.fv.isValidField('iban')).toBeTruthy();
    });

    it('Cameroon', function() {
        this.$iban.val('CM2110003001000500000605306');
        this.fv.validate();
        expect(this.fv.isValidField('iban')).toBeTruthy();
    });

    it('Cape Verde', function() {
        this.$iban.val('CV64000300004547069110176');
        this.fv.validate();
        expect(this.fv.isValidField('iban')).toBeTruthy();
    });

    it('Costa Rica', function() {
        this.$iban.val('CR0515202001026284066');
        this.fv.validate();
        expect(this.fv.isValidField('iban')).toBeTruthy();
    });

    it('Croatia', function() {
        this.$iban.val('HR1210010051863000160');
        this.fv.validate();
        expect(this.fv.isValidField('iban')).toBeTruthy();
    });
    it('Cyprus', function() {
        this.$iban.val('CY17002001280000001200527600');
        this.fv.validate();
        expect(this.fv.isValidField('iban')).toBeTruthy();
    });

    it('Czech Republic', function() {
        this.$iban.val('CZ6508000000192000145399');
        this.fv.validate();
        expect(this.fv.isValidField('iban')).toBeTruthy();
    });

    it('Denmark', function() {
        this.$iban.val('DK5000400440116243');
        this.fv.validate();
        expect(this.fv.isValidField('iban')).toBeTruthy();
    });

    it('Dominican Republic', function() {
        this.$iban.val('DO28BAGR00000001212453611324');
        this.fv.validate();
        expect(this.fv.isValidField('iban')).toBeTruthy();
    });

    it('Estonia', function() {
        this.$iban.val('EE382200221020145685');
        this.fv.validate();
        expect(this.fv.isValidField('iban')).toBeTruthy();
    });
    it('Faroe Islands', function() {
        this.$iban.val('FO1464600009692713');
        this.fv.validate();
        expect(this.fv.isValidField('iban')).toBeTruthy();
    });

    it('Finland', function() {
        this.$iban.val('FI2112345600000785');
        this.fv.validate();
        expect(this.fv.isValidField('iban')).toBeTruthy();
    });

    it('France', function() {
        this.$iban.val('FR1420041010050500013M02606');
        this.fv.validate();
        expect(this.fv.isValidField('iban')).toBeTruthy();
    });

    it('Guatemala', function() {
        this.$iban.val('GT82TRAJ01020000001210029690');
        this.fv.validate();
        expect(this.fv.isValidField('iban')).toBeTruthy();
    });

    it('Georgia', function() {
        this.$iban.val('GE29NB0000000101904917');
        this.fv.validate();
        expect(this.fv.isValidField('iban')).toBeTruthy();
    });

    it('Germany', function() {
        this.$iban.val('DE89370400440532013000');
        this.fv.validate();
        expect(this.fv.isValidField('iban')).toBeTruthy();
    });

    it('Gibraltar', function() {
        this.$iban.val('GI75NWBK000000007099453');
        this.fv.validate();
        expect(this.fv.isValidField('iban')).toBeTruthy();
    });

    it('Greece', function() {
        this.$iban.val('GR1601101250000000012300695');
        this.fv.validate();
        expect(this.fv.isValidField('iban')).toBeTruthy();
    });

    it('Greenland', function() {
        this.$iban.val('GL8964710001000206');
        this.fv.validate();
        expect(this.fv.isValidField('iban')).toBeTruthy();
    });

    it('Hungary', function() {
        this.$iban.val('HU42117730161111101800000000');
        this.fv.validate();
        expect(this.fv.isValidField('iban')).toBeTruthy();
    });

    it('Iceland', function() {
        this.$iban.val('IS140159260076545510730339');
        this.fv.validate();
        expect(this.fv.isValidField('iban')).toBeTruthy();
    });

    it('Iran', function() {
        this.$iban.val('IR580540105180021273113007');
        this.fv.validate();
        expect(this.fv.isValidField('iban')).toBeTruthy();
    });

    it('Ireland', function() {
        this.$iban.val('IE29AIBK93115212345678');
        this.fv.validate();
        expect(this.fv.isValidField('iban')).toBeTruthy();
    });

    it('Israel', function() {
        this.$iban.val('IL620108000000099999999');
        this.fv.validate();
        expect(this.fv.isValidField('iban')).toBeTruthy();
    });

    it('Italy', function() {
        this.$iban.val('IT60X0542811101000000123456');
        this.fv.validate();
        expect(this.fv.isValidField('iban')).toBeTruthy();
    });

    it('Ivory Coast', function() {
        this.$iban.val('CI05A00060174100178530011852');
        this.fv.validate();
        expect(this.fv.isValidField('iban')).toBeTruthy();
    });

    it('Jordan', function() {
        this.$iban.val('JO94CBJO0010000000000131000302');
        this.fv.validate();
        expect(this.fv.isValidField('iban')).toBeTruthy();
    });

    it('Kazakhstan', function() {
        this.$iban.val('KZ176010251000042993');
        this.fv.validate();
        expect(this.fv.isValidField('iban')).toBeTruthy();
    });

    it('Kuwait', function() {
        this.$iban.val('KW74NBOK0000000000001000372151');
        this.fv.validate();
        expect(this.fv.isValidField('iban')).toBeTruthy();
    });

    it('Latvia', function() {
        this.$iban.val('LV80BANK0000435195001');
        this.fv.validate();
        expect(this.fv.isValidField('iban')).toBeTruthy();
    });

    it('Lebanon', function() {
        this.$iban.val('LB30099900000001001925579115');
        this.fv.validate();
        expect(this.fv.isValidField('iban')).toBeTruthy();
    });

    it('Liechtenstein', function() {
        this.$iban.val('LI21088100002324013AA');
        this.fv.validate();
        expect(this.fv.isValidField('iban')).toBeTruthy();
    });

    it('Lithuania', function() {
        this.$iban.val('LT121000011101001000');
        this.fv.validate();
        expect(this.fv.isValidField('iban')).toBeTruthy();
    });

    it('Luxembourg', function() {
        this.$iban.val('LU280019400644750000');
        this.fv.validate();
        expect(this.fv.isValidField('iban')).toBeTruthy();
    });

    it('Macedonia', function() {
        this.$iban.val('MK07300000000042425');
        this.fv.validate();
        expect(this.fv.isValidField('iban')).toBeTruthy();
    });

    it('Madagascar', function() {
        this.$iban.val('MG4600005030010101914016056');
        this.fv.validate();
        expect(this.fv.isValidField('iban')).toBeTruthy();
    });

    it('Malta', function() {
        this.$iban.val('MT84MALT011000012345MTLCAST001S');
        this.fv.validate();
        expect(this.fv.isValidField('iban')).toBeTruthy();
    });

    it('Mauritania', function() {
        this.$iban.val('MR1300012000010000002037372');
        this.fv.validate();
        expect(this.fv.isValidField('iban')).toBeTruthy();
    });

    it('Mauritius', function() {
        this.$iban.val('MU17BOMM0101101030300200000MUR');
        this.fv.validate();
        expect(this.fv.isValidField('iban')).toBeTruthy();
    });

    it('Mali', function() {
        this.$iban.val('ML03D00890170001002120000447');
        this.fv.validate();
        expect(this.fv.isValidField('iban')).toBeTruthy();
    });

    it('Moldova', function() {
        this.$iban.val('MD24AG000225100013104168');
        this.fv.validate();
        expect(this.fv.isValidField('iban')).toBeTruthy();
    });

    it('Monaco', function() {
        this.$iban.val('MC5813488000010051108001292');
        this.fv.validate();
        expect(this.fv.isValidField('iban')).toBeTruthy();
    });

    it('Montenegro', function() {
        this.$iban.val('ME25505000012345678951');
        this.fv.validate();
        expect(this.fv.isValidField('iban')).toBeTruthy();
    });

    it('Mozambique', function() {
        this.$iban.val('MZ59000100000011834194157');
        this.fv.validate();
        expect(this.fv.isValidField('iban')).toBeTruthy();
    });

    it('Netherlands', function() {
        this.$iban.val('NL91ABNA0417164300');
        this.fv.validate();
        expect(this.fv.isValidField('iban')).toBeTruthy();
    });

    it('Norway', function() {
        this.$iban.val('NO9386011117947');
        this.fv.validate();
        expect(this.fv.isValidField('iban')).toBeTruthy();
    });

    it('Pakistan', function() {
        this.$iban.val('PK24SCBL0000001171495101');
        this.fv.validate();
        expect(this.fv.isValidField('iban')).toBeTruthy();
    });

    it('Palestine', function() {
        this.$iban.val('PS92PALS000000000400123456702');
        this.fv.validate();
        expect(this.fv.isValidField('iban')).toBeTruthy();
    });

    it('Poland', function() {
        this.$iban.val('PL27114020040000300201355387');
        this.fv.validate();
        expect(this.fv.isValidField('iban')).toBeTruthy();
    });

    it('Portugal', function() {
        this.$iban.val('PT50000201231234567890154');
        this.fv.validate();
        expect(this.fv.isValidField('iban')).toBeTruthy();
    });

    it('Qatar', function() {
        this.$iban.val('QA58DOHB00001234567890ABCDEFG');
        this.fv.validate();
        expect(this.fv.isValidField('iban')).toBeTruthy();
    });

    it('Romania', function() {
        this.$iban.val('RO49AAAA1B31007593840000');
        this.fv.validate();
        expect(this.fv.isValidField('iban')).toBeTruthy();
    });

    it('San Marino', function() {
        this.$iban.val('SM86U0322509800000000270100');
        this.fv.validate();
        expect(this.fv.isValidField('iban')).toBeTruthy();
    });

    it('Saudi Arabia', function() {
        this.$iban.val('SA0380000000608010167519');
        this.fv.validate();
        expect(this.fv.isValidField('iban')).toBeTruthy();
    });

    it('Senegal', function() {
        this.$iban.val('SN12K00100152000025690007542');
        this.fv.validate();
        expect(this.fv.isValidField('iban')).toBeTruthy();
    });

    it('Serbia', function() {
        this.$iban.val('RS35260005601001611379');
        this.fv.validate();
        expect(this.fv.isValidField('iban')).toBeTruthy();
    });

    it('Slovakia', function() {
        this.$iban.val('SK3112000000198742637541');
        this.fv.validate();
        expect(this.fv.isValidField('iban')).toBeTruthy();
    });

    it('Slovenia', function() {
        this.$iban.val('SI56191000000123438');
        this.fv.validate();
        expect(this.fv.isValidField('iban')).toBeTruthy();
    });

    it('Spain', function() {
        this.$iban.val('ES9121000418450200051332');
        this.fv.validate();
        expect(this.fv.isValidField('iban')).toBeTruthy();
    });

    it('Sweden', function() {
        this.$iban.val('SE3550000000054910000003');
        this.fv.validate();
        expect(this.fv.isValidField('iban')).toBeTruthy();
    });

    it('Switzerland', function() {
        this.$iban.val('CH9300762011623852957');
        this.fv.validate();
        expect(this.fv.isValidField('iban')).toBeTruthy();
    });

    it('Tunisia', function() {
        this.$iban.val('TN5914207207100707129648');
        this.fv.validate();
        expect(this.fv.isValidField('iban')).toBeTruthy();
    });

    it('Turkey', function() {
        this.$iban.val('TR330006100519786457841326');
        this.fv.validate();
        expect(this.fv.isValidField('iban')).toBeTruthy();
    });

    it('United Arab Emirates', function() {
        this.$iban.val('AE260211000000230064016');
        this.fv.validate();
        expect(this.fv.isValidField('iban')).toBeTruthy();
    });

    it('United Kingdom', function() {
        this.$iban.val('GB29NWBK60161331926819');
        this.fv.validate();
        expect(this.fv.isValidField('iban')).toBeTruthy();
    });

    it('Virgin Islands, British', function() {
        this.$iban.val('VG96VPVG0000012345678901');
        this.fv.validate();
        expect(this.fv.isValidField('iban')).toBeTruthy();
    });

    it('invalid checksum', function() {
        this.$iban.val('TR330006100519786457841325');
        this.fv.validate();
        expect(this.fv.isValidField('iban')).toEqual(false);
    });
});
