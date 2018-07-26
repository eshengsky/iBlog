function getDate(value, validator, $field) {
    return validator.getFieldElements('date').val();
};

TestSuite = $.extend({}, TestSuite, {
    Date: {
        getDate: function(value, validator, $field) {
            return validator.getFieldElements('date').val();
        }
    }
});

describe('date', function() {
    beforeEach(function() {
        $([
            '<form class="form-horizontal" id="dateForm">',
                '<div id="msg"></div>',
                '<div class="form-group">',
                    '<input type="text" name="date" data-fv-date />',
                '</div>',
                '<div class="form-group">',
                    '<input type="text" name="minDate" data-fv-date data-fv-date-min="" />',
                '</div>',
                '<div class="form-group">',
                    '<input type="text" name="maxDate" data-fv-date data-fv-date-max="" />',
                '</div>',
                '<div class="form-group">',
                    '<input type="text" name="range" data-fv-date data-fv-date-min="" data-fv-date-max="" />',
                '</div>',
            '</form>'
        ].join('\n')).appendTo('body');

        $('#dateForm').formValidation();

        this.fv       = $('#dateForm').data('formValidation');
        this.$date    = this.fv.getFieldElements('date');
        this.$minDate = this.fv.getFieldElements('minDate');
        this.$maxDate = this.fv.getFieldElements('maxDate');
        this.$range   = this.fv.getFieldElements('range');
    });

    afterEach(function() {
        $('#dateForm').formValidation('destroy').remove();
    });

    it('YYYY/MM/DD', function() {
        this.fv.updateOption('date', 'date', 'format', 'YYYY/MM/DD');

        this.$date.val('2000/01/30');
        this.fv.validate();
        expect(this.fv.isValid()).toBeTruthy();

        // Invalid year
        this.fv.resetForm();
        this.$date.val('100/10/20');
        this.fv.validate();
        expect(this.fv.isValid()).toEqual(false);

        // Invalid month
        this.fv.resetForm();
        this.$date.val('2000/00/10');
        this.fv.validate();
        expect(this.fv.isValid()).toEqual(false);

        this.fv.resetForm();
        this.$date.val('2000/15/10');
        this.fv.validate();
        expect(this.fv.isValid()).toEqual(false);

        // Invalid day
        this.fv.resetForm();
        this.$date.val('2000/03/00');
        this.fv.validate();
        expect(this.fv.isValid()).toEqual(false);

        this.fv.resetForm();
        this.$date.val('2000/10/32');
        this.fv.validate();
        expect(this.fv.isValid()).toEqual(false);

        // Negative number
        this.fv.resetForm();
        this.$date.val('-2000/10/20');
        this.fv.validate();
        expect(this.fv.isValid()).toEqual(false);

        this.fv.resetForm();
        this.$date.val('2000/-10/20');
        this.fv.validate();
        expect(this.fv.isValid()).toEqual(false);

        this.fv.resetForm();
        this.$date.val('2000/10/-20');
        this.fv.validate();
        expect(this.fv.isValid()).toEqual(false);

        // Consist invalid characters
        // Issue #310
        this.fv.resetForm();
        this.$date.val('aaaa/');
        this.fv.validate();
        expect(this.fv.isValid()).toEqual(false);

        this.fv.resetForm();
        this.$date.val('2004df/1dd1/5ffg');
        this.fv.validate();
        expect(this.fv.isValid()).toEqual(false);

        // Issue #475
        this.fv.resetForm();
        this.$date.val('2014/09');
        this.fv.validate();
        expect(this.fv.isValid()).toEqual(false);

        this.fv.resetForm();
        this.$date.val('2014/09/');
        this.fv.validate();
        expect(this.fv.isValid()).toEqual(false);

        this.fv.resetForm();
        this.$date.val('2014//15');
        this.fv.validate();
        expect(this.fv.isValid()).toEqual(false);

        this.fv.resetForm();
        this.$date.val('/09/15');
        this.fv.validate();
        expect(this.fv.isValid()).toEqual(false);
    });

    it('MM/DD/YYYY', function() {
        this.fv.updateOption('date', 'date', 'format', 'MM/DD/YYYY');

        this.$date.val('09/15/2020');
        this.fv.validate();
        expect(this.fv.isValid()).toBeTruthy();

        this.fv.resetForm();
        this.$date.val('09/15');
        this.fv.validate();
        expect(this.fv.isValid()).toEqual(false);

        this.fv.resetForm();
        this.$date.val('09/15/');
        this.fv.validate();
        expect(this.fv.isValid()).toEqual(false);
    });

    // #1102
    it('YYYY-MM-DD h:m', function() {
        this.fv.updateOption('date', 'date', 'format', 'YYYY-MM-DD h:m');

        this.$date.val('2014-11-1 23:10');
        this.fv.validate();
        expect(this.fv.isValid()).toBeTruthy();

        this.fv.resetForm();
        this.$date.val('2014-11-1 23:');
        this.fv.validate();
        expect(this.fv.isValid()).toEqual(false);
    });

    // support#44
    // Support dot (.) as separator for European countries
    it('support dot separator', function() {
        this.fv.updateOption('date', 'date', 'format', 'DD.MM.YYYY');

        this.$date.val('05.11.2014');
        this.fv.validate();
        expect(this.fv.isValid()).toBeTruthy();

        this.fv.resetForm();
        this.$date.val('5.1.2014');
        this.fv.validate();
        expect(this.fv.isValid()).toBeTruthy();

        // Invalid date
        this.fv.resetForm();
        this.$date.val('32.11.2014');
        this.fv.validate();
        expect(this.fv.isValid()).toEqual(false);

        this.fv.resetForm();
        this.$date.val('29.02.2001');
        this.fv.validate();
        expect(this.fv.isValid()).toEqual(false);

        // Invalid month
        this.fv.resetForm();
        this.$date.val('5.14.2014');
        this.fv.validate();
        expect(this.fv.isValid()).toEqual(false);

        // Invalid year
        this.fv.resetForm();
        this.$date.val('05.11.14');
        this.fv.validate();
        expect(this.fv.isValid()).toEqual(false);
    });

    it('number of days in February', function() {
        this.fv.updateOption('date', 'date', 'format', 'YYYY/MM/DD');

        this.$date.val('2000/02/28');
        this.fv.validate();
        expect(this.fv.isValid()).toBeTruthy();

        this.fv.resetForm();
        this.$date.val('2000/02/29');
        this.fv.validate();
        expect(this.fv.isValid()).toBeTruthy();

        this.fv.resetForm();
        this.$date.val('2001/02/29');
        this.fv.validate();
        expect(this.fv.isValid()).toEqual(false);
    });

    // Issue #681
    it('date, month, year are prefixed by zero', function() {
        this.fv.updateOption('date', 'date', 'format', 'MM/DD/YYYY');

        this.$date.val('0012/08/2014');
        this.fv.validate();
        expect(this.fv.isValid()).toEqual(false);

        this.fv.resetForm();
        this.$date.val('12/0008/2014');
        this.fv.validate();
        expect(this.fv.isValid()).toEqual(false);

        this.fv.resetForm();
        this.$date.val('12/08/002014');
        this.fv.validate();
        expect(this.fv.isValid()).toEqual(false);

        this.fv.resetForm();
        this.$date.val('12/08/2014');
        this.fv.validate();
        expect(this.fv.isValid()).toBeTruthy();
    });

    it('hours, minutes, seconds are prefixed by zero', function() {
        this.fv.updateOption('date', 'date', 'format', 'YYYY/MM/DD h:m:s');

        this.$date.val('2014/08/17 0007:30:00');
        this.fv.validate();
        expect(this.fv.isValid()).toEqual(false);

        this.fv.resetForm();
        this.$date.val('2014/08/17 07:030:00');
        this.fv.validate();
        expect(this.fv.isValid()).toEqual(false);

        this.fv.resetForm();
        this.$date.val('2014/08/17 07:30:0000');
        this.fv.validate();
        expect(this.fv.isValid()).toEqual(false);

        this.fv.resetForm();
        this.$date.val('2014/08/17 07:30:00');
        this.fv.validate();
        expect(this.fv.isValid()).toBeTruthy();
    });

    // min test suite
    it('min date format YYYY/MM/DD', function() {
        this.fv.updateOption('minDate', 'date', 'format', 'YYYY/MM/DD');
        this.fv.updateOption('minDate', 'date', 'min', '2010/01/01');

        this.$minDate.val('2010/01/02');
        this.fv.validate();
        expect(this.fv.isValidField('minDate')).toBeTruthy();

        this.fv.resetForm();
        this.$minDate.val('2010/01/002'); // day prefexid by 0 not allowed
        this.fv.validate();
        expect(this.fv.isValidField('minDate')).toEqual(false);

        this.fv.resetForm();
        this.$minDate.val('2014/08/17');
        this.fv.validate();
        expect(this.fv.isValidField('minDate')).toBeTruthy();

        this.fv.resetForm();
        this.$minDate.val('2009/12/31');
        this.fv.validate();
        expect(this.fv.isValidField('minDate')).toEqual(false);

        this.fv.resetForm();
        this.$minDate.val('2000/01/01');
        this.fv.validate();
        expect(this.fv.isValidField('minDate')).toEqual(false);
    });

    it('min date format YYYY-MM-DD', function() {
        this.fv.updateOption('minDate', 'date', 'format', 'YYYY-MM-DD');
        this.fv.updateOption('minDate', 'date', 'min', '2010-01-01');

        this.$minDate.val('2010-01-02');
        this.fv.validate();
        expect(this.fv.isValidField('minDate')).toBeTruthy();

        this.fv.resetForm();
        this.$minDate.val('2010-001-02'); // month prefexid by 0 not allowed
        this.fv.validate();
        expect(this.fv.isValidField('minDate')).toEqual(false);

        this.fv.resetForm();
        this.$minDate.val('2014-08-17');
        this.fv.validate();
        expect(this.fv.isValidField('minDate')).toBeTruthy();

        this.fv.resetForm();
        this.$minDate.val('2009-12-31');
        this.fv.validate();
        expect(this.fv.isValidField('minDate')).toEqual(false);

        this.fv.resetForm();
        this.$minDate.val('2000-01-01');
        this.fv.validate();
        expect(this.fv.isValidField('minDate')).toEqual(false);
    });

    it('min date format DD/MM/YYYY', function() {
        this.fv.updateOption('minDate', 'date', 'format', 'DD/MM/YYYY');
        this.fv.updateOption('minDate', 'date', 'min', '01/01/2010');

        this.$minDate.val('02/01/2010');
        this.fv.validate();
        expect(this.fv.isValidField('minDate')).toBeTruthy();

        this.fv.resetForm();
        this.$minDate.val('17/08/2014');
        this.fv.validate();
        expect(this.fv.isValidField('minDate')).toBeTruthy();

        this.fv.resetForm();
        this.$minDate.val('02/01/02010'); // year prefixed by 0 not allowed
        this.fv.validate();
        expect(this.fv.isValidField('minDate')).toEqual(false);

        this.fv.resetForm();
        this.$minDate.val('31/12/2009');
        this.fv.validate();
        expect(this.fv.isValidField('minDate')).toEqual(false);

        this.fv.resetForm();
        this.$minDate.val('01/01/2000');
        this.fv.validate();
        expect(this.fv.isValidField('minDate')).toEqual(false);
    });

    it('min date format YYYY-MM-DD h:m:s', function() {
        this.fv.updateOption('minDate', 'date', 'format', 'YYYY-MM-DD h:m:s');
        this.fv.updateOption('minDate', 'date', 'min', '2010-01-01 01:00:00');

        this.fv.resetForm();
        this.$minDate.val('2010-01-01 01:00:01');
        this.fv.validate();
        expect(this.fv.isValidField('minDate')).toBeTruthy();

        this.$minDate.val('2010-01-02 01:00:01');
        this.fv.validate();
        expect(this.fv.isValidField('minDate')).toBeTruthy();

        this.fv.resetForm();
        this.$minDate.val('2014-08-17 12:00:00');
        this.fv.validate();
        expect(this.fv.isValidField('minDate')).toBeTruthy();

        this.fv.resetForm();
        this.$minDate.val('2009-12-31 00:00:00');
        this.fv.validate();
        expect(this.fv.isValidField('minDate')).toEqual(false);

        this.fv.resetForm();
        this.$minDate.val('2009-12-31 010:00:00'); // hours prefixed by 0 not allowed
        this.fv.validate();
        expect(this.fv.isValidField('minDate')).toEqual(false);

        this.fv.resetForm();
        this.$minDate.val('2009-12-31 10:001:00'); // minutes prefixed by 0 not allowed
        this.fv.validate();
        expect(this.fv.isValidField('minDate')).toEqual(false);

        this.fv.resetForm();
        this.$minDate.val('2009-12-31 10:01:012'); // seconds prefixed by 0 not allowed
        this.fv.validate();
        expect(this.fv.isValidField('minDate')).toEqual(false);

        this.fv.resetForm();
        this.$minDate.val('2009-12-31 00:00:00');
        this.fv.validate();
        expect(this.fv.isValidField('minDate')).toEqual(false);

        this.fv.resetForm();
        this.$minDate.val('2000-01-01 23:00:12');
        this.fv.validate();
        expect(this.fv.isValidField('minDate')).toEqual(false);
    });

    // max test suite
    it('max date format YYYY/MM/DD', function() {
        this.fv.updateOption('maxDate', 'date', 'format', 'YYYY/MM/DD');
        this.fv.updateOption('maxDate', 'date', 'max', '2014/09/10');

        this.$maxDate.val('2014/09/09');
        this.fv.validate();
        expect(this.fv.isValidField('maxDate')).toBeTruthy();

        this.fv.resetForm();
        this.$maxDate.val('2014/08/17');
        this.fv.validate();
        expect(this.fv.isValidField('maxDate')).toBeTruthy();

        this.fv.resetForm();
        this.$maxDate.val('02014/012/031'); // year, month or day prefixed by 0 not allowed
        this.fv.validate();
        expect(this.fv.isValidField('maxDate')).toEqual(false);

        this.fv.resetForm();
        this.$maxDate.val('2014/12/31');
        this.fv.validate();
        expect(this.fv.isValidField('maxDate')).toEqual(false);

        this.fv.resetForm();
        this.$maxDate.val('2015/01/01');
        this.fv.validate();
        expect(this.fv.isValidField('maxDate')).toEqual(false);
    });

    it('max date format YYYY-MM-DD', function() {
        this.fv.updateOption('maxDate', 'date', 'format', 'YYYY-MM-DD');
        this.fv.updateOption('maxDate', 'date', 'max', '2014-09-10');

        this.$maxDate.val('2014-09-09');
        this.fv.validate();
        expect(this.fv.isValidField('maxDate')).toBeTruthy();

        this.fv.resetForm();
        this.$maxDate.val('2014-08-17');
        this.fv.validate();
        expect(this.fv.isValidField('maxDate')).toBeTruthy();

        this.fv.resetForm();
        this.$maxDate.val('02014-012-031');  // year, month or day prefixed by 0 not allowed
        this.fv.validate();
        expect(this.fv.isValidField('maxDate')).toEqual(false);

        this.fv.resetForm();
        this.$maxDate.val('2014-12-31');
        this.fv.validate();
        expect(this.fv.isValidField('maxDate')).toEqual(false);

        this.fv.resetForm();
        this.$maxDate.val('2015-01-01');
        this.fv.validate();
        expect(this.fv.isValidField('maxDate')).toEqual(false);
    });

    it('max date format DD/MM/YYYY', function() {
        this.fv.updateOption('maxDate', 'date', 'format', 'DD/MM/YYYY');
        this.fv.updateOption('maxDate', 'date', 'max', '10/09/2014');

        this.$maxDate.val('09/09/2014');
        this.fv.validate();
        expect(this.fv.isValidField('maxDate')).toBeTruthy();

        this.fv.resetForm();
        this.$maxDate.val('17/08/2014');
        this.fv.validate();
        expect(this.fv.isValidField('maxDate')).toBeTruthy();

        this.fv.resetForm();
        this.$maxDate.val('031/012/02014'); // year, month or day prefixed by 0 not allowed
        this.fv.validate();
        expect(this.fv.isValidField('maxDate')).toEqual(false);

        this.fv.resetForm();
        this.$maxDate.val('31/12/2014');
        this.fv.validate();
        expect(this.fv.isValidField('maxDate')).toEqual(false);

        this.fv.resetForm();
        this.$maxDate.val('01/01/2015');
        this.fv.validate();
        expect(this.fv.isValidField('maxDate')).toEqual(false);
    });

    it('max date format YYYY-MM-DD h:m:s', function() {
        this.fv.updateOption('maxDate', 'date', 'format', 'YYYY-MM-DD h:m:s');
        this.fv.updateOption('maxDate', 'date', 'max', '2014-09-10 01:00:00');

        this.$maxDate.val('2014-09-09 01:00:01');
        this.fv.validate();
        expect(this.fv.isValidField('maxDate')).toBeTruthy();

        this.fv.resetForm();
        this.$maxDate.val('2014-08-17 12:00:00');
        this.fv.validate();
        expect(this.fv.isValidField('maxDate')).toBeTruthy();

        this.fv.resetForm();
        this.$maxDate.val('2014-09-09 001:001:001'); // hours, minutes or seconds prefixed by 0 not allowed
        this.fv.validate();
        expect(this.fv.isValidField('maxDate')).toEqual(false);

        this.fv.resetForm();
        this.$maxDate.val('2014-12-31 00:00:00');
        this.fv.validate();
        expect(this.fv.isValidField('maxDate')).toEqual(false);

        this.fv.resetForm();
        this.$maxDate.val('2015-01-01 23:00:12');
        this.fv.validate();
        expect(this.fv.isValidField('maxDate')).toEqual(false);
    });

    // range test suite
    it('range format YYYY/MM/DD', function() {
        this.fv.updateOption('range', 'date', 'format', 'YYYY/MM/DD');
        this.fv.updateOption('range', 'date', 'min', '2010/09/10');
        this.fv.updateOption('range', 'date', 'max', '2014/09/10');

        this.$range.val('2011/01/01');
        this.fv.validate();
        expect(this.fv.isValidField('range')).toBeTruthy();

        this.fv.resetForm();
        this.$range.val('2014/09/09');
        this.fv.validate();
        expect(this.fv.isValidField('range')).toBeTruthy();

        this.fv.resetForm();
        this.$range.val('02014/001/031'); // year, month or day prefixed by 0 not allowed
        this.fv.validate();
        expect(this.fv.isValidField('range')).toEqual(false);

        this.fv.resetForm();
        this.$range.val('2010/09/09');
        this.fv.validate();
        expect(this.fv.isValidField('range')).toEqual(false);

        this.fv.resetForm();
        this.$range.val('2014/09/11');
        this.fv.validate();
        expect(this.fv.isValidField('range')).toEqual(false);
    });

    it('range format YYYY-MM-DD', function() {
        this.fv.updateOption('range', 'date', 'format', 'YYYY-MM-DD');
        this.fv.updateOption('range', 'date', 'min', '2010-09-10');
        this.fv.updateOption('range', 'date', 'max', '2014-09-10');

        this.$range.val('2012-01-12');
        this.fv.validate();
        expect(this.fv.isValidField('range')).toBeTruthy();

        this.fv.resetForm();
        this.$range.val('2014-09-09');
        this.fv.validate();
        expect(this.fv.isValidField('range')).toBeTruthy();

        this.fv.resetForm();
        this.$range.val('02014-003-031');  // year, month or day prefixed by 0 not allowed
        this.fv.validate();
        expect(this.fv.isValidField('range')).toEqual(false);

        this.fv.resetForm();
        this.$range.val('2009-12-31');
        this.fv.validate();
        expect(this.fv.isValidField('range')).toEqual(false);

        this.fv.resetForm();
        this.$range.val('2015-01-01');
        this.fv.validate();
        expect(this.fv.isValidField('range')).toEqual(false);
    });

    it('range format DD/MM/YYYY', function() {
        this.fv.updateOption('range', 'date', 'format', 'DD/MM/YYYY');
        this.fv.updateOption('range', 'date', 'min', '10/09/2010');
        this.fv.updateOption('range', 'date', 'max', '10/09/2014');

        this.$range.val('11/11/2011');
        this.fv.validate();
        expect(this.fv.isValidField('range')).toBeTruthy();

        this.fv.resetForm();
        this.$range.val('17/08/2014');
        this.fv.validate();
        expect(this.fv.isValidField('range')).toBeTruthy();

        this.fv.resetForm();
        this.$range.val('031/012/02013'); // year, month or day prefixed by 0 not allowed
        this.fv.validate();
        expect(this.fv.isValidField('range')).toEqual(false);

        this.fv.resetForm();
        this.$range.val('31/01/2010');
        this.fv.validate();
        expect(this.fv.isValidField('range')).toEqual(false);

        this.fv.resetForm();
        this.$range.val('25/03/2015');
        this.fv.validate();
        expect(this.fv.isValidField('range')).toEqual(false);
    });

    it('range format YYYY-MM-DD h:m:s', function() {
        this.fv.updateOption('range', 'date', 'format', 'YYYY-MM-DD h:m:s');
        this.fv.updateOption('range', 'date', 'min', '2010-05-15 22:00:00');
        this.fv.updateOption('range', 'date', 'max', '2015-05-15 22:00:00');

        this.$range.val('2012-07-17 01:00:01');
        this.fv.validate();
        expect(this.fv.isValidField('range')).toBeTruthy();

        this.fv.resetForm();
        this.$range.val('2013-08-17 12:00:00');
        this.fv.validate();
        expect(this.fv.isValidField('range')).toBeTruthy();

        this.fv.resetForm();
        this.$range.val('2011-06-19 001:001:001'); // hours, minutes or seconds prefixed by 0 not allowed
        this.fv.validate();
        expect(this.fv.isValidField('range')).toEqual(false);

        this.fv.resetForm();
        this.$range.val('2008-11-27 23:15:00');
        this.fv.validate();
        expect(this.fv.isValidField('range')).toEqual(false);

        this.fv.resetForm();
        this.$range.val('2015-05-15 22:00:01');
        this.fv.validate();
        expect(this.fv.isValidField('range')).toEqual(false);
    });

    // dynamic min option
    it('dynamic min: name of field', function() {
        this.$minDate.attr('data-fv-date-min', 'date');
        this.fv.destroy();
        this.fv = $('#dateForm').formValidation().data('formValidation');
        this.fv.updateOption('minDate', 'date', 'format', 'YYYY/MM/DD');

        this.$date.val('2014/09/08');
        this.$minDate.val('2014/09/09');
        this.fv.validate();
        expect(this.fv.isValidField('minDate')).toBeTruthy();

        this.fv.resetForm();
        this.$date.val('2014/09/08');
        this.$minDate.val('2014/08/17');
        this.fv.validate();
        expect(this.fv.isValidField('minDate')).toBeFalsy();
    });

    it('dynamic min: callback declarative function', function() {
        this.$minDate.attr('data-fv-date-min', 'getDate');
        this.fv.destroy();
        this.fv = $('#dateForm').formValidation().data('formValidation');
        this.fv.updateOption('minDate', 'date', 'format', 'YYYY/MM/DD');

        this.$date.val('2014/09/08');
        this.$minDate.val('2014/09/09');
        this.fv.validate();
        expect(this.fv.isValidField('minDate')).toBeTruthy();

        this.fv.resetForm();
        this.$date.val('2014/10/01');
        this.$minDate.val('2014/08/17');
        this.fv.validate();
        expect(this.fv.isValidField('minDate')).toBeFalsy();
    });

    it('dynamic min: callback declarative function()', function() {
        this.$minDate.attr('data-fv-date-min', 'getDate()');
        this.fv.destroy();
        this.fv = $('#dateForm').formValidation().data('formValidation');
        this.fv.updateOption('minDate', 'date', 'format', 'YYYY/MM/DD');

        this.$date.val('2014/09/08');
        this.$minDate.val('2014/09/09');
        this.fv.validate();
        expect(this.fv.isValidField('minDate')).toBeTruthy();

        this.fv.resetForm();
        this.$date.val('2014/10/01');
        this.$minDate.val('2014/08/17');
        this.fv.validate();
        expect(this.fv.isValidField('minDate')).toBeFalsy();
    });

    it('dynamic min: callback declarative A.B.C', function() {
        this.$minDate.attr('data-fv-date-min', 'TestSuite.Date.getDate');
        this.fv.destroy();
        this.fv = $('#dateForm').formValidation().data('formValidation');
        this.fv.updateOption('minDate', 'date', 'format', 'YYYY/MM/DD');

        this.$date.val('2014/09/08');
        this.$minDate.val('2014/09/09');
        this.fv.validate();
        expect(this.fv.isValidField('minDate')).toBeTruthy();

        this.fv.resetForm();
        this.$date.val('2014/10/01');
        this.$minDate.val('2014/08/17');
        this.fv.validate();
        expect(this.fv.isValidField('minDate')).toBeFalsy();
    });

    it('dynamic min: callback declarative A.B.C()', function() {
        this.$minDate.attr('data-fv-date-min', 'TestSuite.Date.getDate()');
        this.fv.destroy();
        this.fv = $('#dateForm').formValidation().data('formValidation');
        this.fv.updateOption('minDate', 'date', 'format', 'YYYY/MM/DD');

        this.$date.val('2014/09/08');
        this.$minDate.val('2014/09/09');
        this.fv.validate();
        expect(this.fv.isValidField('minDate')).toBeTruthy();

        this.fv.resetForm();
        this.$date.val('2014/10/01');
        this.$minDate.val('2014/08/17');
        this.fv.validate();
        expect(this.fv.isValidField('minDate')).toBeFalsy();
    });

    it('dynamic min: callback programmatically', function() {
        this.$minDate.removeAttr('data-fv-date-min');
        this.fv.destroy();
        this.fv = $('#dateForm')
                        .formValidation({
                            fields: {
                                minDate: {
                                    validators: {
                                        date: {
                                            min: function(value, validator, $field) {
                                                return getDate(value, validator, $field);
                                            }
                                        }
                                    }
                                }
                            }
                        })
                        .data('formValidation');
        this.fv.updateOption('minDate', 'date', 'format', 'YYYY/MM/DD');

        this.$date.val('2014/09/08');
        this.$minDate.val('2014/09/09');
        this.fv.validate();
        expect(this.fv.isValidField('minDate')).toBeTruthy();

        this.fv.resetForm();
        this.$date.val('2014/10/01');
        this.$minDate.val('2014/08/17');
        this.fv.validate();
        expect(this.fv.isValidField('minDate')).toBeFalsy();
    });

    // dynamic max option
    it('dynamic max: name of field', function() {
        this.$maxDate.attr('data-fv-date-max', 'date');
        this.fv.destroy();
        this.fv = $('#dateForm').formValidation().data('formValidation');
        this.fv.updateOption('maxDate', 'date', 'format', 'YYYY/MM/DD');

        this.$date.val('2015/01/01');
        this.$maxDate.val('2014/09/09');
        this.fv.validate();
        expect(this.fv.isValidField('maxDate')).toBeTruthy();

        this.fv.resetForm();
        this.$date.val('2014/01/01');
        this.$maxDate.val('2014/08/17');
        this.fv.validate();
        expect(this.fv.isValidField('maxDate')).toBeFalsy();
    });

    it('dynamic max: callback declarative function', function() {
        this.$maxDate.attr('data-fv-date-max', 'getDate');
        this.fv.destroy();
        this.fv = $('#dateForm').formValidation().data('formValidation');
        this.fv.updateOption('maxDate', 'date', 'format', 'YYYY/MM/DD');

        this.$date.val('2015/01/01');
        this.$maxDate.val('2014/09/09');
        this.fv.validate();
        expect(this.fv.isValidField('maxDate')).toBeTruthy();

        this.fv.resetForm();
        this.$date.val('2014/01/01');
        this.$maxDate.val('2014/08/17');
        this.fv.validate();
        expect(this.fv.isValidField('maxDate')).toBeFalsy();
    });

    it('dynamic max: callback declarative function()', function() {
        this.$maxDate.attr('data-fv-date-max', 'getDate()');
        this.fv.destroy();
        this.fv = $('#dateForm').formValidation().data('formValidation');
        this.fv.updateOption('maxDate', 'date', 'format', 'YYYY/MM/DD');

        this.$date.val('2015/01/01');
        this.$maxDate.val('2014/09/09');
        this.fv.validate();
        expect(this.fv.isValidField('maxDate')).toBeTruthy();

        this.fv.resetForm();
        this.$date.val('2014/01/01');
        this.$maxDate.val('2014/08/17');
        this.fv.validate();
        expect(this.fv.isValidField('maxDate')).toBeFalsy();
    });

    it('dynamic max: callback declarative A.B.C', function() {
        this.$maxDate.attr('data-fv-date-max', 'TestSuite.Date.getDate');
        this.fv.destroy();
        this.fv = $('#dateForm').formValidation().data('formValidation');
        this.fv.updateOption('maxDate', 'date', 'format', 'YYYY/MM/DD');

        this.$date.val('2015/01/01');
        this.$maxDate.val('2014/09/09');
        this.fv.validate();
        expect(this.fv.isValidField('maxDate')).toBeTruthy();

        this.fv.resetForm();
        this.$date.val('2014/01/01');
        this.$maxDate.val('2014/08/17');
        this.fv.validate();
        expect(this.fv.isValidField('maxDate')).toBeFalsy();
    });

    it('dynamic max: callback declarative A.B.C()', function() {
        this.$maxDate.attr('data-fv-date-max', 'TestSuite.Date.getDate()');
        this.fv.destroy();
        this.fv = $('#dateForm').formValidation().data('formValidation');
        this.fv.updateOption('maxDate', 'date', 'format', 'YYYY/MM/DD');

        this.$date.val('2015/01/01');
        this.$maxDate.val('2014/09/09');
        this.fv.validate();
        expect(this.fv.isValidField('maxDate')).toBeTruthy();

        this.fv.resetForm();
        this.$date.val('2014/01/01');
        this.$maxDate.val('2014/08/17');
        this.fv.validate();
        expect(this.fv.isValidField('maxDate')).toBeFalsy();
    });

    it('dynamic max: callback programmatically', function() {
        this.$maxDate.removeAttr('data-fv-date-max');
        this.fv.destroy();
        this.fv = $('#dateForm')
                        .formValidation({
                            fields: {
                                maxDate: {
                                    validators: {
                                        date: {
                                            max: function(value, validator, $field) {
                                                return getDate(value, validator, $field);
                                            }
                                        }
                                    }
                                }
                            }
                        })
                        .data('formValidation');
        this.fv.updateOption('maxDate', 'date', 'format', 'YYYY/MM/DD');

        this.$date.val('2015/01/01');
        this.$maxDate.val('2014/09/09');
        this.fv.validate();
        expect(this.fv.isValidField('maxDate')).toBeTruthy();

        this.fv.resetForm();
        this.$date.val('2014/01/01');
        this.$maxDate.val('2014/08/17');
        this.fv.validate();
        expect(this.fv.isValidField('maxDate')).toBeFalsy();
    });

    // #1258: Using a Date object as value for the min or the max option
    // min
    it('min using a date object', function() {
        this.$minDate.removeAttr('data-fv-date-min');
        this.fv.destroy();
        this.fv = $('#dateForm')
            .formValidation({
                fields: {
                    minDate: {
                        validators: {
                            date: {
                                min: new Date()
                            }
                        }
                    }
                }
            })
            .data('formValidation');
        this.fv.updateOption('minDate', 'date', 'format', 'YYYY/MM/DD');

        this.$minDate.val('2018/09/09');
        this.fv.validate();
        expect(this.fv.isValidField('minDate')).toBeTruthy();

        this.fv.resetForm();
        this.$minDate.val('2019/08/17');
        this.fv.validate();
        expect(this.fv.isValidField('minDate')).toBeTruthy();

        this.fv.resetForm();
        this.$minDate.val('2011/08/17');
        this.fv.validate();
        expect(this.fv.isValidField('minDate')).toBeFalsy();
    });

    it('min using a date object: callback programmatically', function() {
        this.$minDate.removeAttr('data-fv-date-min');
        this.fv.destroy();
        this.fv = $('#dateForm')
            .formValidation({
                fields: {
                    minDate: {
                        validators: {
                            date: {
                                min: function(value, validator, $field) {
                                    return new Date();
                                }
                            }
                        }
                    }
                }
            })
            .data('formValidation');
        this.fv.updateOption('minDate', 'date', 'format', 'YYYY/MM/DD');

        this.$minDate.val('2018/09/09');
        this.fv.validate();
        expect(this.fv.isValidField('minDate')).toBeTruthy();

        this.fv.resetForm();
        this.$minDate.val('2019/08/17');
        this.fv.validate();
        expect(this.fv.isValidField('minDate')).toBeTruthy();

        this.fv.resetForm();
        this.$minDate.val('2011/08/17');
        this.fv.validate();
        expect(this.fv.isValidField('minDate')).toBeFalsy();
    });

    // max
    it('max using a date object', function() {
        this.$maxDate.removeAttr('data-fv-date-max');
        this.fv.destroy();
        this.fv = $('#dateForm')
            .formValidation({
                fields: {
                    maxDate: {
                        validators: {
                            date: {
                                max:  new Date()
                            }
                        }
                    }
                }
            })
            .data('formValidation');
        this.fv.updateOption('maxDate', 'date', 'format', 'YYYY/MM/DD');

        this.$maxDate.val('2014/09/09');
        this.fv.validate();
        expect(this.fv.isValidField('maxDate')).toBeTruthy();

        this.fv.resetForm();
        this.$maxDate.val('2014/08/17');
        this.fv.validate();
        expect(this.fv.isValidField('maxDate')).toBeTruthy();
    });

    it('max using a date object: callback programmatically', function() {
        this.$maxDate.removeAttr('data-fv-date-max');
        this.fv.destroy();
        this.fv = $('#dateForm')
            .formValidation({
                fields: {
                    maxDate: {
                        validators: {
                            date: {
                                max: function(value, validator, $field) {
                                    return new Date();
                                }
                            }
                        }
                    }
                }
            })
            .data('formValidation');
        this.fv.updateOption('maxDate', 'date', 'format', 'YYYY/MM/DD');

        this.$maxDate.val('2014/09/09');
        this.fv.validate();
        expect(this.fv.isValidField('maxDate')).toBeTruthy();

        this.fv.resetForm();
        this.$maxDate.val('2014/08/17');
        this.fv.validate();
        expect(this.fv.isValidField('maxDate')).toBeTruthy();
    });

    // Range
    it('range using a date object', function() {
        this.$range.removeAttr('data-fv-date-min');
        this.$range.removeAttr('data-fv-date-max');
        this.fv.destroy();
        this.fv = $('#dateForm')
            .formValidation({
                fields: {
                    range: {
                        validators: {
                            date: {
                                min: new Date(),
                                max: new Date(2015, 11, 31, 0, 0, 0, 0)
                            }
                        }
                    }
                }
            })
            .data('formValidation');
        this.fv.updateOption('range', 'date', 'format', 'YYYY/MM/DD');

        this.$range.val('2015/09/09');
        this.fv.validate();
        expect(this.fv.isValidField('range')).toBeTruthy();

        this.fv.resetForm();
        this.$range.val('2015/08/17');
        this.fv.validate();
        expect(this.fv.isValidField('range')).toBeTruthy();
    });

    it('range using a date object: callback programmatically', function() {
        this.$range.removeAttr('data-fv-date-min');
        this.$range.removeAttr('data-fv-date-max');
        this.fv.destroy();
        this.fv = $('#dateForm')
            .formValidation({
                fields: {
                    range: {
                        validators: {
                            date: {
                                min: function(value, validator, $field) {
                                    return new Date();
                                },
                                max: function(value, validator, $field) {
                                    return new Date(2015, 11, 31, 0, 0, 0, 0);
                                }
                            }
                        }
                    }
                }
            })
            .data('formValidation');
        this.fv.updateOption('range', 'date', 'format', 'YYYY/MM/DD');

        this.$range.val('2015/09/09');
        this.fv.validate();
        expect(this.fv.isValidField('range')).toBeTruthy();

        this.fv.resetForm();
        this.$range.val('2015/08/17');
        this.fv.validate();
        expect(this.fv.isValidField('range')).toBeTruthy();
    });
});
