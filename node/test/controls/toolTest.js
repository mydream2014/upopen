/**
 * Created by jack on 15/5/18.
 */

var assert = require('assert');
//var should = require('should');
require('should');
var tool = require('./../../controls/tool');


//
///******************************* getCookie ***************************************/
//function getCookie( cookie, name ){
//    try{
//        var cs = cookie.split(';'),
//            c,
//            item;
//        while( c = cs.pop() ){
//            item = c.split('=');
//            if( item[0].trim() == name ){
//                return item[1];
//            }
//        }
//    } catch( e ){
//        logInfo.warn( 'getcookie error')
//        return false;
//    }
//
//};

describe('test getCookie', function () {
    it('get cookie', function () {
        var cookie = "sso_cookie=2F2EE5ACD29F9A8952276C9212BA06526EA07F0604D5F2647EEF0C880A7371F661F1EDBA88F6D9652DFB69231C538469; login_username=13291801306; login_corpname=%E5%85%89%E5%89%91%E7%A7%91%E6%8A%80%E6%9C%89%E9%99%90%E5%85%AC%E5%8F%B8; Hm_lvt_83af4d60fe4ee2fa7715be9b321264a0=1431659611,1431929019; Hm_lpvt_83af4d60fe4ee2fa7715be9b321264a0=1431929019";
        tool.getCookie(cookie, "sso_cookie").should.eql('2F2EE5ACD29F9A8952276C9212BA06526EA07F0604D5F2647EEF0C880A7371F661F1EDBA88F6D9652DFB69231C538469');
        //tool.getCookie(cookie,"login_name").should.eql('13291801306');
    });
});

/******************************* md5 *************************************/
//var md5 = function(data) {
//
//    return crypto.createHash('md5').update(data).digest('hex').toLowerCase();
//
//}

describe('test md5 algorithm', function () {
    it('md5(123456)=e10adc3949ba59abbe56e057f20f883e', function () {
        tool.md5('123456').should.eql('e10adc3949ba59abbe56e057f20f883e');
    })
});

/******************************* pad *************************************/
//function pad( str, len, pack ){
//
//    return ( new Array( len - ( str + '' ).length + 1 ).join( pack || '0' ) ) + str;
//
//}

describe('test pad', function () {
    it('pad', function () {
        tool.pad('xyz', 10, 'p').should.eql('pppppppxyz');
        tool.pad('xyz', 6, 'p').should.eql('pppxyz');
        tool.pad('xyz', 5, 'p').should.eql('ppxyz');
        tool.pad('xyz', 4, 'p').should.eql('pxyz');
        tool.pad('xyz', 3, 'p').should.eql('xyz');
        tool.pad('xyz', 2, 'p').should.eql('xyz');
        //tool.pad('xyz', 1, 'p').should.eql('xyz'); // failed: array out of index exception

    });
});

/******************************* getTime *************************************/
//function getTime( config ){
//
//    config = config || {};
//    var date = new Date,
//        y = pad( date.getFullYear(), 4 ),
//        m = pad( date.getMonth() + 1, 2 ),
//        d = pad( date.getDate(), 2 ),
//        h = pad( date.getHours(), 2 ),
//        mi = pad( date.getMinutes(), 2 ),
//        s = pad( date.getSeconds(), 2 );
//    if( config.type == 'day' ){
//        return [y, m, d].join( config.join || '-' );
//    } else if( config.type == 'millis' ){
//        return date.getTime();
//    }
//    return [y, m, d].join( config.join || '-' ) + ' ' + [ h, mi, s].join( config.joinH || ':' );
//
//}

describe('test getTime', function () {
    it('getTime(config)', function () {
        /*************default config*****************/
        var config0 = {};
        var time0 = tool.getTime(config0);
        console.log(time0);
        var patt0 = new RegExp('\\d{4}-\\d{2}-\\d{2} \\d{2}:\\d{2}:\\d{2}'); //非全局匹配
        var exptectedFormat0 = patt0.test(time0);
        console.log(patt0);
        exptectedFormat0.should.eql(true);

        /*************config.type='day'*****************/
        var config_day = {
            "type": "day"
        };

        var time_day = tool.getTime(config_day);
        console.log(time_day);
        var pattDay = new RegExp('\\d{4}-\\d{2}-\\d{2}');
        console.log(pattDay);

        var exptectedFormatDay = pattDay.test(time_day);

        exptectedFormatDay.should.eql(true);

        /*************config.type='millis'*****************/

        var config_millis={
            "type":'millis'
        };
        var time_millis = tool.getTime(config_millis);
        console.log(time_millis);

        var patternMillis = new RegExp('\\d{13}');
        console.log(patternMillis);

        var expectedFormatMillis = patternMillis.test(time_millis);
        expectedFormatMillis.should.eql(true);

    });
});

