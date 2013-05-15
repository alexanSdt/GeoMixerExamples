function FiresTree() {
    var re = /\[%\s([^%]+)\s%\]/g;
    
    this.template = function(tmpl, def) {
        def = def || {};
        
        var func = tmpl.replace(/'/g,"\\'").replace(re, function (a, b) {
            if (def.hasOwnProperty(b)) {
                return "'+(hash.hasOwnProperty(\"" + b + "\")?hash[\"" + b + "\"]:\"" + def[b] + "\")+'";
            } else {
                return "'+hash[\"" + b + "\"]+'";
            }
        });

        return new Function("hash", "return '" + func + "'");
    };
    
    this.mapTemplate = this.template(
        '<ul class="filetree">' +
            '[% html %]' +
        '</ul');
    
    this.treeTemplate = this.template(
            '<li>' +
                '<div mapid="[% MapID %]">' +
                    '<div style="display: inline; position: relative; border-bottom: medium none; padding-right: 3px;">' +
                        '<span class="groupLayer">[% title %]</span>' +
                    '</div>' +
                '</div>' +
                '<ul>' +
                    '[% children %]' +
                '</ul>' +
            '</li>');
    this.groupTemplate = this.template(
        '<li>' +
            '<div groupid="[% GroupID %]">' +
                '<div titlediv="true" style="display: inline; position: relative; border-bottom: medium none; padding-right: 3px;">' +
                    '<span style="-moz-user-select: none;" class="groupLayer">[% title %]</span>' +
                '</div>' +
            '</div>' +
            '<ul [% groupInvisible %]>' +
                '[% children %]' +
            '</ul>' +
            '<div swap="true" class="swap" style="font-size: 0px;"></div>' +
        '</li>');
    this.layerTemplate = this.template(
        '<li>' +
            '<div layerid="[% LayerID %]" layerName="[% layerName %]">' +
                '<input type="checkbox" class="box" [% checked %] [% iefix %]>' +
                '<div titlediv="true" style="display: inline; position: relative; border-bottom: medium none; padding-right: 3px;" [% invisible %]>' +
                    '<span style="-moz-user-select: none;" class="layer">[% title %]</span>' +
                    '[% description %]' +
                '</div>' +
            '</div>' +
            '<div swap="true" class="swap" style="font-size: 0px;"></div>' +
        '</li>', {description: "", minZoom: ""});
    this.layerIeFix = 'style="margin:-3px -2px 0px -2px"';
    this.layerChecked = 'checked="true"';
    this.groupInvisible = 'class="groupInvisible"';
    this.layerInvisible = 'class="invisible"';
    this.layerDescriptionTemplate = this.template('<span class="layerDescription">[% title %]</span>');
}

FiresTree.prototype.drawTree = function(tree, parent) {
    var html = "",
        children = "",
        child;
        
    for (var i = 0, l = tree.children.length; i < l; i++) {
        child = tree.children[i];
        
        if (child.type == "group") {
            children += this.drawGroup(child);
        } else if (child.type == "layer") {
            children += this.drawLayer(child);
        }
    }
    
    html = this.treeTemplate({
        MapID: tree.properties.MapID,
        title: tree.properties.title,
        children: children
    });
    
    if (typeof parent != "undefined") {
        this.addParent(parent, html);
    }
    
    return html;
};

FiresTree.prototype.drawGroup = function(group, parent) {
    var html = "",
        children = "",
        child;
        
    for (var i = 0, l = group.content.children.length; i < l; i++) {
        child = group.content.children[i];
        
        if (child.type == "group") {
            children += this.drawGroup(child);
        } else if (child.type == "layer") {
            children += this.drawLayer(child);
        }
    }
    
    html = this.groupTemplate({
        GroupID: group.content.properties.GroupID,
        title: group.content.properties.title,
        groupInvisible: group.content.properties.visible ? "" : this.groupInvisible,
        children: children
    });
    
    if (typeof parent != "undefined") {
        this.addParent(parent, html);
    }
    
    return html;
};

FiresTree.prototype.drawLayer = function(layer, parent) {
    var html = "";
    
    html = this.layerTemplate({
        LayerID: layer.content.properties.LayerID,
        title: layer.content.properties.title,
        checked: layer.content.properties.visible ? this.layerChecked : "",
        invisible: layer.content.properties.visible ? "" : this.layerInvisible,
        description: layer.content.properties.description ? this.layerDescriptionTemplate({
                title: layer.content.properties.description
            }) : "",
        iefix: $.browser.msie ? this.layerIeFix : "",
        layerName: layer.content.properties.name
    });
    
    if (typeof parent != "undefined") {
        this.addParent(parent, html);
    }
    
    return html;
};

FiresTree.prototype.addParent = function(parent, html) {
    parent.append(this.mapTemplate({html: html}));
    
    $(".filetree", parent).treeview();
    
    this.addVisibleEvents(parent);
    
    this.fixInvisible(parent);
};

FiresTree.prototype.findGroup = function(group, GroupID) {
    var children = group.children ? group.children : group.content.children,
        child,
        res = null;
    
    for (var i = 0, l = children.length; i < l; i++) {
        child = children[i];
        
        if (child.type == "group") {
            if (String(child.content.properties.GroupID) == String(GroupID)) {
                return child;
            } else {
                res = this.findGroup(child, GroupID);
                
                if (res) {
                    return res;
                }
            }
        }
    }
    
    return null;
};

FiresTree.prototype.findLayer = function(group, LayerID) {
    var children = group.children ? group.children : group.content.children,
        child,
        res = null;
    
    for (var i = 0, l = children.length; i < l; i++) {
        child = children[i];
        
        if (child.type == "layer") {
            if (String(child.content.properties.LayerID) == String(LayerID)) {
                return child;
            }
        } else if (child.type == "group") {
            res = this.findLayer(child, LayerID);
            
            if (res) {
                return res;
            }
        }
    }
    
    return null;
};

FiresTree.prototype.addVisibleEvents = function(parent) {
    $(".box", parent).click(function () {
        var layer = $(this).parent(),
            name = layer.attr("layerName");
        
        globalFlashMap.layers[name].setVisible(this.checked);
        
        $("[titlediv]", layer).toggleClass("invisible");
    });
    
    $("[titlediv]", parent).click(function () {
        var layer = $(this).parent(),
            box = $(".box", layer)[0],
            name = layer.attr("layerName");
            
        if (!box.checked) {
            box.checked = true;
            
            globalFlashMap.layers[name].setVisible(true);
            
            $(this).removeClass("invisible");
        }
    });
    
    var self = this;
    
    $("[titlediv]", parent).click(function () {
        var layer = $(this).parent(),
            mapLayer = globalFlashMap.layers[layer.attr("layerName")];
        
        if (layer) {
            self.layerZoomToExtent(mapLayer.getLayerBounds(), self.getMinLayerZoom(mapLayer));
        }
    });
};

FiresTree.prototype.layerZoomToExtent = function(bounds, minZoom) {
    var z = globalFlashMap.getBestZ(bounds.minX, bounds.minY, bounds.maxX, bounds.maxY);
    
    if (minZoom != 20) {
        z = Math.max(z, minZoom);
    }
    
    globalFlashMap.moveTo(
        from_merc_x((merc_x(bounds.minX) + merc_x(bounds.maxX))/2),
        from_merc_y((merc_y(bounds.minY) + merc_y(bounds.maxY))/2),
        z);
};

FiresTree.prototype.getMinLayerZoom = function(layer) {
    var minLayerZoom = 20;
    
    for (var i = 0; i < layer.properties.styles.length; i++) {
        minLayerZoom = Math.min(minLayerZoom, layer.properties.styles[i].MinZoom);
    }
    
    return minLayerZoom;
};

FiresTree.prototype.fixInvisible = function(parent) {
    $(".groupInvisible", parent).each(function() {
        $(this).parent().children(".hitarea").removeClass("collapsable-hitarea").addClass("expandable-hitarea");
    });
};


