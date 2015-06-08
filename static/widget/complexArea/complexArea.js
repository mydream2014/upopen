require.config({
	baseUrl: basePath,
	paths: {
		areaData: 'widget/complexArea/areaData'
	}
})
define([ 'areaData' ], function( areaData ){

	function initComplexArea(a, k, h, p, q, d, b, l) {
		l = d;
		b = q;
		d = p;
		p = areaData.area_array;
		q = areaData.sub_array;
		var sub_arr = areaData.sub_arr;
		var f = initComplexArea.arguments;
		var m = document.getElementById(a);
		$( m ).on( 'change', function(){
			changeComplexProvince(this.value, q, k, h);
		} )
		var o = document.getElementById(k);
		$( o ).on( 'change', function(){
			changeCity(this.value, h, h);
		} )
		var n = document.getElementById(h);
		var e = 0;
		var c = 0;
		if (p != undefined) {
			
			if (d != undefined) {
				d = parseInt(d);
			}
			else {
				d = 0;
			}
			if (b != undefined) {
				b = parseInt(b);
			}
			else {
				b = 0;
			}
			if (l != undefined) {
				l = parseInt(l);
			}
			else {
				l = 0
			}
			//n[0] = new Option("请选择 ", 0);
			for (e = 0; e < p.length; e++) {
				if (p[e] == undefined) {
					continue;
				}
				if (f[6]) {
					if (f[6] == true) {
						if (e == 0) {
							continue
						}
					}
				}
				m[c] = new Option(p[e], e);
				if (d == e) {
					m[c].selected = true;
				}
				c++
			}
			if (q[d] != undefined) {
				c = 0; for (e = 0; e < q[d].length; e++) {
					if (q[d][e] == undefined) { continue }
					if (f[6]) {
						if ((f[6] == true) && (d != 71) && (d != 81) && (d != 82)) {
							if ((e % 100) == 0) { continue }
						}
					} ;
					
					o[c] = new Option(q[d][e], e);
					if (b == e) { o[c].selected = true } c++
				}
			}
			var ls = b * 100,
				lsa = sub_arr[b],
				arr = [],
				el;
			$( n ).append( $( '<option>' ).attr( 'value', 0 ).html( '请选择' ) );
			
			for( var i = ls; i < ls + 100; i++ ){
				if( lsa[i] ){
					el = $( '<option>' ).attr( 'value', i ).html( lsa[i] ); //new Option( lsa[i], i )
					if( i == l ){
						el.selected = true;
					}
					$( n ).append( el )
				}
			}
			
			
		}
	}
	function changeComplexProvince(f, k, e, d) {
		var c = changeComplexProvince.arguments; var h = document.getElementById(e);
		var g = document.getElementById(d); var b = 0; var a = 0; removeOptions(h); f = parseInt(f);
		if (k[f] != undefined) {
			for (b = 0; b < k[f].length; b++) {
				if (k[f][b] == undefined) { continue }
				if (c[3]) { if ((c[3] == true) && (f != 71) && (f != 81) && (f != 82)) { if ((b % 100) == 0) { continue } } }
				h[a] = new Option(k[f][b], b); a++
			}
		}
		removeOptions(g); g[0] = new Option("请选择 ", 0);
		if (f == 11 || f == 12 || f == 31 || f == 71 || f == 50 || f == 81 || f == 82) {
			if ($("#" + d + "_div"))
			{ $("#" + d + "_div").hide(); }
		}
		else {
			if ($("#" + d + "_div")) { $("#" + d + "_div").show(); }
		}
	}

	 
	function changeCity(c, a, t) {
		$("#" + a).html('<option value="0" >请选择</option>');
		$("#" + a).unbind("change");
		c = parseInt(c); 
		var _d = areaData.sub_arr[c];
		var str = "";
		if( _d ){
			str += "<option value='0' >请选择</option>";
			for (var i = c * 100; i < _d.length; i++) {
				if (_d[i] == undefined) continue; 
				str += "<option value='" + i + "' >" + _d[i] + "</option>";
			}
			$("#" + a).html(str);
			$("#" + a).show();
		} else {
			$("#" + a).html(str);
			$("#" + a).hide();
		}  
		
	}

	function removeOptions(c) {
		if ((c != undefined) && (c.options != undefined)) {
			var a = c.options.length;
			for (var b = 0; b < a; b++) {
				c.options[0] = null;
			}
		}
	}
	return {
		initComplexArea: initComplexArea
	}

})

