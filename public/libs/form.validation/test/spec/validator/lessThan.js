function lessThanCompare() {
    var compareTo = $('#lessThanForm').find('[name="maxAge"]').val();
    $('#msg').html('lessThanCompare() called; compare to ' + compareTo);
    return compareTo;
};

TestSuite = $.extend({}, TestSuite, {
    lessThan: {
        compareTo: function(value, validator, $field) {
            var compareTo = $('#lessThanForm').find('[name="maxAge"]').val();
            $('#msg').html('TestSuite.lessThan.compareTo() called; compare to ' + compareTo);
            return compareTo;
        }
    }
});

describe('lessThan', function() {
    beforeEach(function() {
        $([
            '<form class="form-horizontal" id="lessThanForm">',
                '<div id="msg"></div>',
                '<div class="form-group">',
                    '<input type="text" name="maxAge" />',
                '</div>',
                '<div class="form-group">',
                    '<input type="text" name="age" data-fv-lessthan data-fv-lessthan-value="100" />',
                '</div>',
            '</form>'
        ].join('\n')).appendTo('body');

        $('#lessThanForm').formValidation();

        this.fv      = $('#lessThanForm').data('formValidation');
        this.$maxAge = this.fv.getFieldElements('maxAge');
        this.$age    = this.fv.getFieldElements('age');
    });

    afterEach(function() {
        $('#lessThanForm').formValidation('destroy').remove();
    });

    it('not a number', function() {
        this.$age.val('20abc');
        this.fv.validate();
        expect(this.fv.isValid()).toEqual(false);
    });

    it('value with comma separator', function() {
        this.$age.val('120,2234');
        this.fv.validate();
        expect(this.fv.isValid()).toEqual(false);

        this.fv.resetForm();
        this.$age.val('30,2234');
        this.fv.validate();
        expect(this.fv.isValid()).toBeTruthy();
    });

    it('compare to value', function() {
        this.$age.val(120);
        this.fv.validate();
        expect(this.fv.isValid()).toEqual(false);

        this.fv.resetForm();
        this.$age.val(30);
        this.fv.validate();
        expect(this.fv.isValid()).toBeTruthy();
    });

    it('compare to other field', function() {
        this.fv.updateOption('age', 'lessThan', 'value', 'maxAge');

        this.$maxAge.val(40);
        this.$age.val(20);
        this.fv.validate();
        expect(this.fv.isValid()).toBeTruthy();

        this.fv.resetForm();
        this.$maxAge.val(20);
        this.$age.val(30);
        this.fv.validate();
        expect(this.fv.isValid()).toEqual(false);
        expect(this.fv.getMessages('age', 'lessThan')[0]).toEqual(FormValidation.Helper.format(FormValidation.I18n[this.fv.getLocale()].lessThan['default'], this.$maxAge.val()));
    });

    // #1048
    it('compare to other field that value has comma', function() {
        this.fv.updateOption('age', 'lessThan', 'value', 'maxAge');
        this.$maxAge.val('30,5');
        this.$age.val(20);
        this.fv.validate();
        expect(this.fv.isValid()).toBeTruthy();

        this.fv.resetForm();
        this.$maxAge.val('20,5');
        this.$age.val(30);
        this.fv.validate();
        expect(this.fv.isValid()).toEqual(false);
        expect(this.fv.getMessages('age', 'lessThan')[0]).toEqual(FormValidation.Helper.format(FormValidation.I18n[this.fv.getLocale()].lessThan['default'], this.$maxAge.val()));
    });

    it('compare to return value of a function', function() {
        this.fv.updateOption('age', 'lessThan', 'value', 'lessThanCompare');

        this.$maxAge.val(50);
        this.$age.val(60);
        this.fv.validate();
        expect($('#msg').html()).toEqual('lessThanCompare() called; compare to 50');
        expect(this.fv.isValid()).toEqual(false);
        expect(this.fv.getMessages('age', 'lessThan')[0]).toEqual(FormValidation.Helper.format(FormValidation.I18n[this.fv.getLocale()].lessThan['default'], this.$maxAge.val()));

        this.fv.resetForm();
        this.$maxAge.val(60);
        this.$age.val(30);
        this.fv.validate();
        expect($('#msg').html()).toEqual('lessThanCompare() called; compare to 60');
        expect(this.fv.isValid()).toBeTruthy();
    });

    it('compare to return value of a namespace function', function() {
        this.fv.updateOption('age', 'lessThan', 'value', 'TestSuite.lessThan.compareTo');

        this.$maxAge.val(50);
        this.$age.val(60);
        this.fv.validate();
        expect($('#msg').html()).toEqual('TestSuite.lessThan.compareTo() called; compare to 50');
        expect(this.fv.isValid()).toEqual(false);
        expect(this.fv.getMessages('age', 'lessThan')[0]).toEqual(FormValidation.Helper.format(FormValidation.I18n[this.fv.getLocale()].lessThan['default'], this.$maxAge.val()));

        this.fv.resetForm();
        this.$maxAge.val(60);
        this.$age.val(30);
        this.fv.validate();
        expect($('#msg').html()).toEqual('TestSuite.lessThan.compareTo() called; compare to 60');
        expect(this.fv.isValid()).toBeTruthy();
    });
});
