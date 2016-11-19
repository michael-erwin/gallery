(function($){
    $.fn.searchHint = function() {

        var hint_box = $('#search_hint_box');
        var search_box = this;
        var press_timer = null;
        var data = [];
        var keyword = "";
        var highlight_index = null;

        search_box.focus(function(){if(keyword.length > 0) hint_box.addClass("active")});
        search_box.blur(function(){setTimeout(function(){hint_box.removeClass("active")},200);});
        search_box.keydown(function(e){
            if(e.keyCode === 38) {keyUp();}
            else if(e.keyCode === 40) {keyDown();}
            else if(e.keyCode === 27) {hint_box.removeClass("active");}
            else {clearTimeout(press_timer);press_timer = setTimeout(fetch,500);}
        });

        function fetch() {
            var keyword = $.trim(search_box.val());
            if(keyword.length > 0) {
                $.ajax({
                    method: 'GET',
                    url: site.base_url+'search/tags',
                    data: 'kw='+keyword,
                    success: function(response) {
                        data = response;
                        render();
                    }
                });
            }
            else {
                search_box.val("");
                data = [];
                hint_box.removeClass("active");
            }
        }

        function render() {
            var hints_html = '<ul>';
            if(data.length > 0) {
                for(var i in data) {
                    if(highlight_index == i) {
                        hints_html += '<li class="tag-ready active" data-index="'+i+'">'+data[i].name+'</li>';
                    }
                    else {
                        hints_html += '<li class="tag-ready" data-index="'+i+'">'+data[i].name+'</li>';
                    }
                }
            }
            else {
                hints_html += '<li>No tags match.</li>';
            }
            hints_html += '</ul>';
            hint_box.html(hints_html);
            hint_box.removeClass('active').addClass('active');
            hint_box.find('li.tag-ready').mouseenter(function(){
                hint_box.find('li.tag-ready').removeClass('active');
                highlight_index = $(this).attr('data-index');
                //console.log($(this).attr('data-index'));
                $(this).addClass('active');
            })
            .unbind('click').click(clickHint);
        }

        function clickHint(e) {
            var hint = $(e.target);
            search_box.val(hint.text());
            hint.parents("form").trigger('submit');
            hint_box.removeClass('active');
        }

        function keyUp() {
            if(data.length > 0) {
                if(highlight_index > 0) highlight_index--;
                search_box.val(data[highlight_index].name);
                render();
            }
        }

        function keyDown() {
            if(data.length > 0) {
                //if((typeof highlight_index) == "object") highlight_index=0;
                if(highlight_index === null){highlight_index = 0;}
                else if(highlight_index < (data.length-1)){highlight_index++;}
                search_box.val(data[highlight_index].name);
                render();
            } 
        }
    }
}(jQuery))