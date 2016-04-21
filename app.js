// Generated by CoffeeScript 1.10.0
(function() {
  document.addEventListener('DOMContentLoaded', function(event) {
    var calloutDelegate, current_annotation, map, pending_update, search_engine;
    mapkit.init({
      apiKey: 'b2af5300a3c2ea9b5d38c782c7d2909dc88d6621',
      bootstrapUrl: './bootstrap.json'
    });
    map = new mapkit.Map('map');
    map.showsUserLocation = false;
    map.showsUserLocationControl = true;
    calloutDelegate = {
      calloutContentForAnnotation: function(annotation) {
        var element, subtitle, title;
        element = document.createElement('div');
        element.className = 'mk-standard';
        title = element.appendChild(document.createElement('div'));
        title.className = 'mk-title';
        title.textContent = annotation.title;
        subtitle = element.appendChild(document.createElement('div'));
        subtitle.className = 'mk-subtitle';
        subtitle.textContent = annotation.subtitle;
        return element;
      }
    };
    current_annotation = null;
    pending_update = null;
    search_engine = new mapkit.Search();
    return $('document').ready(function() {
      var focusTarget, hide_suggestions, initialTarget, permalink, search, search_field, search_form, search_suggestions, search_suggestions_ul;
      permalink = $('#permalink');
      focusTarget = function(target) {
        var annotation_data, exportURL;
        if (!((target.title != null) && (target.subtitle != null))) {
          map.setRegionAnimated(new mapkit.CoordinateRegion(new mapkit.Coordinate(target.latitude, target.longitude), new mapkit.CoordinateSpan(0.16, 0.16)));
          return;
        }
        map.region = new mapkit.CoordinateRegion(new mapkit.Coordinate(target.latitude, target.longitude), new mapkit.CoordinateSpan(0.16, 0.16));
        annotation_data = {
          callout: calloutDelegate,
          title: target.title,
          subtitle: target.subtitle,
          url: {
            1: "greenDot.png",
            2: "greenDot@2x.png"
          }
        };
        if (current_annotation != null) {
          map.removeAnnotation(current_annotation);
        }
        current_annotation = new mapkit.ImageAnnotation(new mapkit.Coordinate(target.latitude, target.longitude), annotation_data);
        map.addAnnotation(current_annotation);
        exportURL = "/?lat=" + target.latitude + "&lon=" + target.longitude + "&title=" + (encodeURIComponent(target.title)) + "&subtitle=" + (encodeURIComponent(target.subtitle));
        permalink.attr('href', exportURL);
        return permalink.show();
      };
      if ((QueryString.lat != null) && (QueryString.lon != null)) {
        initialTarget = {
          latitude: parseFloat(QueryString.lat),
          longitude: parseFloat(QueryString.lon)
        };
        if (QueryString.title != null) {
          initialTarget.title = decodeURIComponent(QueryString.title);
        }
        if (QueryString.subtitle != null) {
          initialTarget.subtitle = decodeURIComponent(QueryString.subtitle);
        }
        setTimeout(function() {
          return focusTarget(initialTarget);
        }, 200);
      } else {
        initialTarget = {
          latitude: 37.782851,
          longitude: -122.409333
        };
        focusTarget(initialTarget);
        permalink.hide();
      }
      hide_suggestions = $('#hide-suggestions');
      search_suggestions = $('#search-suggestions');
      search_suggestions_ul = $('#search-suggestions ul');
      search = function(search_term) {
        if (pending_update != null) {
          clearTimeout(pending_update);
        }
        return search_engine.autocomplete(search_term, function(err, res) {
          var i, item, items, len, ref, ref1, ref2;
          if (res && res.results) {
            items = [];
            ref = res.results;
            for (i = 0, len = ref.length; i < len; i++) {
              item = ref[i];
              if (item.coordinate && item.displayLines) {
                items.push({
                  latitude: item.coordinate.latitude,
                  longitude: item.coordinate.longitude,
                  title: (ref1 = item.displayLines[0]) != null ? ref1 : '',
                  subtitle: (ref2 = item.displayLines[1]) != null ? ref2 : ''
                });
              }
            }
            if (items.length > 0) {
              return pending_update = setTimeout(function() {
                var j, len1;
                search_suggestions.show();
                hide_suggestions.show();
                search_suggestions_ul.html('');
                for (j = 0, len1 = items.length; j < len1; j++) {
                  item = items[j];
                  search_suggestions_ul.append("<li><a href=\"\#\"data-latitude=\"" + item.latitude + "\" data-longitude=\"" + item.longitude + "\" data-title=\"" + item.title + "\" data-subtitle=\"" + item.subtitle + "\"><span class=\"title\">" + item.title + "</span><span class=\"subtitle\">" + item.subtitle + "</span></a></li>");
                }
                return focusTarget(items[0]);
              }, 200);
            }
          }
        });
      };
      search_field = $('#search');
      search_form = $('#search-form');
      hide_suggestions.on('click', function(e) {
        e.preventDefault;
        hide_suggestions.hide();
        search_suggestions.hide();
        return false;
      });
      search_suggestions.on('click', 'a[data-latitude]', function(e) {
        var link, target;
        e.preventDefault();
        link = $(this);
        target = {
          latitude: parseFloat(link.attr('data-latitude')),
          longitude: parseFloat(link.attr('data-longitude')),
          title: link.attr('data-title'),
          subtitle: link.attr('data-subtitle')
        };
        focusTarget(target);
        return false;
      });
      search_form.on('submit', function(e) {
        e.preventDefault();
        search(search_field.val());
        return false;
      });
      return search_field.on('input', function() {
        return search(search_field.val());
      });
    });
  });

}).call(this);

//# sourceMappingURL=app.js.map
