/*!
 * Modified by Felinger 16.04.2015 v2.5
 * tap.js
 * Copyright (c) 2013 Alex Gibson, http://alxgbsn.co.uk/
 * Released under MIT license
 */
var browserCustom = true;
if(!window.CustomEvent) { // Create only if it doesn't exist
    (function () {
        function CustomEvent ( event, params ) {
            params = params || { bubbles: true, cancelable: true, detail: undefined };
            var evt = document.createEvent( 'CustomEvent' );
            evt.initCustomEvent( event, params.bubbles, params.cancelable, params.detail );
            return evt;
        };
        CustomEvent.prototype = window.Event.prototype;
        window.CustomEvent = CustomEvent;
        browserCustom = false;
    })();
}
(function (window, document){
    'use strict';
    function Tap(el, tapClass){
        this.el = typeof el === 'object' ? el : document.getElementById(el);

        this.tapClass = tapClass;
        this.tapEl = (tapClass) ? null : el;

        this.moved = false;                     //flags if the finger has moved
        this.stillTouching = false;             //flags if the finger still on screen
        this.hasTouchEventOccured = false;      //flag touch event
        this.threshold = 10;                    // Threshold for prevent tap on move and more in future

        this.tapholdTime = 850;                 // taphold
        this.tapholded = false;                 // taphold
        this.startTime = 0;                     // taphold
        
        this.el.addEventListener('touchstart', this, false);
        this.el.addEventListener('touchmove', this, false);
        this.el.addEventListener('touchend', this, false);
        this.el.addEventListener('touchcancel', this, false);
    
        if(browserCustom){
            this.el.addEventListener('mousedown', this, false);
            this.el.addEventListener('mouseup', this, false);
            this.el.addEventListener('mousemove', this, false);
        }
        //el.addEventListener('mouseout', this, false);
    }
    Tap.prototype.start = function(e){
        if(e.type === 'touchstart') this.hasTouchEventOccured = true;

        e.stopPropagation();

        this.moved = false;
        this.startX = e.type === 'touchstart' ? e.touches[0].pageX : e.pageX;
        this.startY = e.type === 'touchstart' ? e.touches[0].pageY : e.pageY;
        this.stillTouching = true;

        // add tap class
        if(this.tapClass && this.el != e.target){
            var obj = e.target;

            while(!obj.classList.contains(this.tapClass)){
                if(obj === this.el) break;
                obj = obj.parentNode;
            }
            
            this.tapEl = obj;
        }else this.tapEl = e.target;

        this.tapEl.classList.add('tap'); 
        
        // taphold
        var nID;
        this.startTime = nID = Number(new Date());
        var that = this;
        setTimeout(function(){
            if(!that.moved && that.stillTouching && that.startTime == nID){
                that.startTime = 0;
                that.tapholded = true;
                that.moved = false;
                var evt;
                // Taphold
                if(window.CustomEvent){
                    evt = new window.CustomEvent('taphold', {
                        bubbles: true,
                        cancelable: true,
                        detail: {cTarget: that.tapEl}
                    });
                }else{
                    evt = document.createEvent('Event');
                    evt.initEvent('taphold', true, true);
                }

                e.stopPropagation();
                if(!e.target.dispatchEvent(evt)){
                    e.preventDefault();
                }
                clearTimeout();
                that.tapholded = true;
                that.tapEl.classList.remove('tap');
            }
        }, this.tapholdTime);
    };
    Tap.prototype.move = function(e){
        //if finger moves more than 10px flag to cancel
        this.currX = e.type === 'touchmove' ? e.touches[0].pageX : e.pageX;
        this.currY = e.type === 'touchmove' ? e.touches[0].pageY : e.pageY;

        this.swipeLength = Math.round(Math.sqrt(Math.pow(this.currX - this.startX,2) + Math.pow(this.currY - this.startY,2)));
        if(this.swipeLength > this.threshold){
            var X = this.startX - this.currX;
            var Y = this.currY - this.startY;
            var Z = Math.round(Math.sqrt(Math.pow(X,2)+Math.pow(Y,2)));
            var r = Math.atan2(Y,X);
            this.swipeAngle = Math.round(r*180/Math.PI);
            if(this.swipeAngle < 0) this.swipeAngle = 360 - Math.abs(this.swipeAngle);

            if((this.swipeAngle <= 45) && (this.swipeAngle >= 0)){
                this.swipeDirection = 'left';
            }else if((this.swipeAngle <= 360) && (this.swipeAngle >= 315)){
                this.swipeDirection = 'left';
            }else if((this.swipeAngle >= 135) && (this.swipeAngle <= 225)){
                this.swipeDirection = 'right';
            }else if((this.swipeAngle > 45) && (this.swipeAngle < 135)){
                this.swipeDirection = 'down';
            }else{
                this.swipeDirection = 'up';
            }
        }else{
            //this.cancel();
        }

        if(Math.abs(this.currX - this.startX) > this.threshold || Math.abs(this.currY - this.startY) > this.threshold){
            this.moved = true;
            this.tapholded = false;
            this.tapEl.classList.remove('tap');
        }
    };
    Tap.prototype.end = function(e){
        if(this.tapholded){
            this.cancel();
            return;
        }
        this.stillTouching = false;
        this.tapEl.classList.remove('tap');
        var evt;
        // Check to usefull
        if(this.hasTouchEventOccured && e.type === 'mouseup'){
            e.preventDefault();
            this.hasTouchEventOccured = false;
            return;
        }

        if(!this.moved && !this.tapholded){
            // Tap
            if(window.CustomEvent){
                evt = new window.CustomEvent('tap', {
                    bubbles: true,
                    cancelable: true,
                    detail: {cTarget: this.tapEl}
                });
            }else{
                evt = document.createEvent('Event');
                evt.initEvent('tap', true, true);
            }
            
            e.stopPropagation();
            if(!e.target.dispatchEvent(evt)){
                e.preventDefault();
            }
        }else{
            var that = this;
            // Swipe
            if(window.CustomEvent){
                evt = new window.CustomEvent('swipe', {
                    bubbles: true,
                    cancelable: true,
                    detail: {cTarget: this.tapEl, length: this.swipeLength, angle: this.swipeAngle, direction: this.swipeDirection}
                });
            }else{
                evt = document.createEvent('Event');
                evt.initEvent('swipe', true, true);
            }
            e.stopPropagation();
            if(!e.target.dispatchEvent(evt)){
                e.preventDefault();
            }
        }
    };
    Tap.prototype.cancel = function(e){
        this.hasTouchEventOccured = false;
        this.tapEl.classList.remove('tap');
        this.moved = false;
        this.startX = 0;
        this.startY = 0;
        this.stillTouching = false;
        this.tapholded = false;
        
        this.swipeLength = 0;
        this.swipeAngle = null;
        this.swipeDirection = null;
    };
    Tap.prototype.destroy = function(){
        this.el.removeEventListener('touchstart', this, false);
        this.el.removeEventListener('touchmove', this, false);
        this.el.removeEventListener('touchend', this, false);
        this.el.removeEventListener('touchcancel', this, false);

        if(browserCustom){
            this.el.removeEventListener('mousedown', this, false);
            this.el.removeEventListener('mouseup', this, false);
            this.el.removeEventListener('mousemove', this, false);
            //el.removeEventListener('mouseout', this, false);
        }
        this.el = null;
    };
    Tap.prototype.handleEvent = function(e){
        switch(e.type){
            case 'touchstart': this.start(e); break;
            case 'touchmove': this.move(e); break;
            case 'touchend': this.end(e); break;
            case 'touchcancel': this.cancel(e); break;
        }
        if(browserCustom){
            switch(e.type){
                case 'mousedown': this.start(e); break;
                case 'mouseup': this.end(e); break;
                case 'mousemove': this.move(e); break;
                //case 'mouseout': this.cancel(e); break;
            }
        }
    };
    window.Tap = Tap;
}(window, document));