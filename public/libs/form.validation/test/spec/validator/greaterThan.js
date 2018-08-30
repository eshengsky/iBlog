function greaterThanCompare() {
    var compareTo = $('#greaterThanForm').find('[name="minAge"]').val();
    $('#msg').html('greaterThanCompare() called; compare to ' + compareTo);
    return compareTo;
};

TestSuite = $.extend({}, TestSuite, {
    greaterThan: {
        compareTo: function(value, validator, $field) {
            var compareTo = $('#greaterThanForm').find('[name="minAge"]').val();
            $('#msg').html('TestSuite.greaterThan.compareTo() called; compare to ' + compareTo);
            return compareTo;
        }
    }
});

describe('greaterThan', function() {
    beforeEach(function() {
        $([
            '<form class="form-horizontal" id="greaterThanForm">',
                '<div id="msg"></div>',
                '<div class="form-group">',
                    '<input type="text" name="minAge" />',
                '</div>',
                '<div class="form-group">',
                    '<input type="text" name="age" data-fv-greaterthan data-fv-greaterthan-value="18" />',
                '</div>',
            '</form>'
        ].join('\n')).appendTo('body');

        $('#greaterThanForm').formValidation();

        this.fv      = $('#greaterThanForm').data('formValidation');
        this.$minAge = this.fv.getFieldElements('minAge');
        this.$age    = this.fv.getFieldElements('age');
    });

    afterEach(function() {
        $('#greaterThanForm').formValidation('destroy').remove();
    });

    it('not a number', function() {
        this.$age.val('20abc');
        this.fv.validate();
        expect(this.fv.isValid()).toEqual(false);
    });

    it('compare to value', function() {
        this.$age.val(10);
        this.fv.validate();
        expect(this.fv.isValid()).toEqual(false);

        this.fv.resetForm();
        this.$age.val(20);
        this.fv.validate();
        expect(this.fv.isValid()).toBeTruthy();
    });

    it('value with comma separator', function() {
        this.$age.val('10,4');
        this.fv.validate();
        expect(this.fv.isValid()).toEqual(false);

        this.fv.resetForm();
        this.$age.val('18,678');
        this.fv.validate();
        expect(this.fv.isValid()).toBeTruthy();
    });

    it('compare to other field', function() {
        this.fv.updateOption('age', 'greaterThan', 'value', 'minAge');

        this.$minAge.val(10);
        this.$age.val(20);
        this.fv.validate();
        expect(this.fv.isValid()).toBeTruthy();

        this.fv.resetForm();
        this.$minAge.val(20);
        this.$age.val(10);
        this.fv.validate();
        expect(this.fv.isValid()).toEqual(false);
        expect(this.fv.getMessages('age', 'greaterThan')[0]).toEqual(FormValidation.Helper.format(FormValidation.I18n[this.fv.getLocale()].greaterThan['default'], this.$minAge.val()));
    });

    // #1048
    it('compare to other field that value has comma', function() {
        this.fv.updateOption('age', 'greaterThan', 'value', 'minAge');
        this.$minAge.val('10,5');
        this.$age.val(20);
        this.fv.validate();
        expect(this.fv.isValid()).toBeTruthy();

        this.fv.resetForm();
        this.$minAge.val('20,5');
        this.$age.val(10);
        this.fv.validate();
        expect(this.fv.isValid()).toEqual(false);
        expect(this.fv.getMessages('age', 'greaterThan')[0]).toEqual(FormValidation.Helper.format(FormValidation.I18n[this.fv.getLocale()].greaterThan['default'], this.$minAge.val()));
    });

    it('compare to return value of a function', function() {
        this.fv.updateOption('age', 'greaterThan', 'value', 'greaterThanCompare');

        this.$minAge.val(20);
        this.$age.val(18);
        this.fv.validate();
        expect($('#msg').html()).toEqual('greaterThanCompare() called; compare to 20');
        expect(this.fv.isValid()).toEqual(false);
        expect(this.fv.getMessages('age', 'greaterThan')[0]).toEqual(FormValidation.Helper.format(FormValidation.I18n[this.fv.getLocale()].greaterThan['default'], this.$minAge.val()));

        this.fv.resetForm();
        this.$minAge.val(18);
        this.$age.val(20);
        this.fv.validate();
        expect($('#msg').html()).toEqual('greaterThanCompare() called; compare to 18');
        expect(this.fv.isValid()).toBeTruthy();
    });

    it('compare to return value of a namespace function', function() {
        this.fv.updateOption('age', 'greaterThan', 'value', 'TestSuite.greaterThan.compareTo');

        this.$minAge.val(20);
        this.$age.val(18);
        this.fv.validate();
        expect($('#msg').html()).toEqual('TestSuite.greaterThan.compareTo() called; compare to 20');
        expect(this.fv.isValid()).toEqual(false);
        expect(this.fv.getMessages('age', 'greaterThan')[0]).toEqual(FormValidation.Helper.format(FormValidation.I18n[this.fv.getLocale()].greaterThan['default'], this.$minAge.val()));

        this.fv.resetForm();
        this.$minAge.val(18);
        this.$age.val(20);
        this.fv.validate();
        expect($('#msg').html()).toEqual('TestSuite.greaterThan.compareTo() called; compare to 18');
        expect(this.fv.isValid()).toBeTruthy();
    });
});
