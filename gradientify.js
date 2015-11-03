/**
 * Gradient editor
 *
 * @author  Avraam Mavridis   <avraam.mavridis@sociomantic.com>
 *
 */
$.fn.gradientify = function() {

    var $selectedStop = null;
    var that = this;
    this.append('<div class="gradient-editor"></div>');
    var editor = $('.gradient-editor');

    editor.append( '<input value="#000000" type="color" class="gradient-stop" style="left: 0px; height: 54px;background-color: white;width: 10px;position: absolute;float: left;margin-top: -4px;padding: 0px;"/>' );
    editor.append( '<input value="#ffffff" type="color" class="gradient-stop" style="left: 500px; height: 54px;background-color: white;width: 10px;position: absolute;float: left;margin-top: -4px;padding: 0px;"/>' );

    /* Initialize main container */
    editor.css({
        width:  '500px',
        height: '50px',
        border: '2px solid black',
        display: 'block',
        position: 'relative'
    });

    /* Prevent event bubbling */
    $( ".gradient-stop" ).dblclick( function( e ){
        e.stopPropagation();
    });

    /* Add gradient stop on doubleclick */
    editor.dblclick( function( e ) {
        var relX = getStopPosition( e );

        editor.append( '<input type="color" class="gradient-stop" style="left: ' + relX + 'px; height: 54px;background-color: white;width: 10px;position: absolute;float: left;margin-top: -4px;padding: 0px;"/>' );
        setGradient();
    });

    /* Drag gradient stop to a new position */
    editor.on( "mousemove", function( e ) {
        var pos = getStopPosition( e );
        if ( $selectedStop && pos <= 500 ) {
              $selectedStop.css({ left: pos });
        }
        setGradient();
    });

    editor.on( "mousedown", function ( e ) {
        if( $( e.target ).hasClass('gradient-stop') ){
            $selectedStop = $(e.target);
            $( ".gradient-stop" ).change(function(){
                setGradient();
            });
        }
    });

    editor.on( "mouseup", function ( e ) {
        $selectedStop = null;
        setGradient();
    });

    /* Returns the position where the gradient-stop will be placed */
    var getStopPosition = function ( event )
    {
        var parentOffset = $( event.target ).parent().offset();
        return event.pageX - parentOffset.left;
    }

    var setGradient = function()
    {
        var angle = $( '#angle' ).val() || 90;
        var _background = 'linear-gradient(' + angle +'deg';
        var stops = getStops();

        stops.forEach( function(stop)
        {
            _background += ',' + stop.color + ' ' + stop.perc + '%';
        });
           _background += ')';

        editor.css({ background: _background });
    }

    /* Returns array of gradient stops */
    var getStops = function(){
      var  stops = [];

      $( ".gradient-stop" ).each(function( index ) {
        var color = $(this).val();
        var perc = ( +$(this).css("left").replace('px','') /500 ) * 100;
        stops.push({ color: color, perc: perc });
      });

      stops.sort(function(a, b){
        return a.perc - b.perc;
      });

      return stops;
    }

    setGradient();

    $('#angle').change(function(){setGradient()});

};
