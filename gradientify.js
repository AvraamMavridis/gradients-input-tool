/**
 * Gradient editor
 *
 * @author  Avraam Mavridis   <avraam.mavridis@sociomantic.com>
 *
 */
$.fn.gradientify = function( options ) {
    var options = options || {};
    var width = options.width;

    var $selectedStop = null;
    var $lastSelectedStop = null;
    var that = this;
    this.append('<div class="gradient-editor"></div>');
    var editor = $('.gradient-editor');

    editor.append( '<input value="#000000" type="color" class="gradient-stop" style="left: 0px; height: 54px;background-color: white;width: 10px;position: absolute;float: left;margin-top: -4px;padding: 0px;"/>' );
    editor.append( '<input value="#ffffff" type="color" class="gradient-stop" style="left: ' + width + 'px; height: 54px;background-color: white;width: 10px;position: absolute;float: left;margin-top: -4px;padding: 0px;"/>' );

    /* Initialize main container */
    editor.css({
        width:  width + 'px',
        height: '50px',
        border: '2px solid black',
        display: 'block',
        position: 'relative'
    });
  
    $(document).keypress(function(e)
    {
      var SPACE_KEY = 32;
      console.log( $lastSelectedStop, e.which )
      if( $lastSelectedStop)
       {
         $lastSelectedStop.remove();
         setGradient();
       }
    });
  


    /* Prevent event bubbling */
    $( ".gradient-stop" ).dblclick( function( e ){
        e.stopPropagation();
    });

    /* Add gradient stop on doubleclick */
    editor.dblclick( function( e ) {
        var relX = getStopPosition( e );

        $lastSelectedStop = editor.append( '<input type="color" class="gradient-stop" style="left: ' + relX + 'px; height: 54px;background-color: white;width: 10px;position: absolute;float: left;margin-top: -4px;padding: 0px;"/>' );
        setGradient();
    });

    /* Drag gradient stop to a new position */
    editor.on( "mousemove", function( e ) {
        var pos = getStopPosition( e );
        if ( $selectedStop && pos <= width ) {
              $selectedStop.css({ left: pos });
        }
        setGradient();
    });

    editor.on( "mousedown", function ( e ) {
        if( $( e.target ).hasClass('gradient-stop') ){
            $selectedStop = $(e.target);
            $lastSelectedStop = $(e.target);
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
        var perc = ( +$(this).css("left").replace('px','') / width ) * 100;
        stops.push({ color: color, perc: perc });
      });

      stops.sort(function(a, b){
        return a.perc - b.perc;
      });

      return stops;
    }

    setGradient();

};
