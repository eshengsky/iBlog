# Supersized jQuery Plugin

Documentation can be found on the official project page: [http://www.buildinternet.com/project/supersized/](http://www.buildinternet.com/project/supersized/)

*** Changelog ***

2/23/12 - 3.2.7

	*Fixed issue with previous thumbnail not loading correctly
	*Autoplay now works when no transition is specified
	*Updated Shutter theme CSS for smooth opacity transition when thumbnails are hovered over.

11/28/11 - 3.2.6

	*Fixed issue where previous slide was not displaying after goTo()
	*Update supersized.3.2.6.js

9/23/11 - 3.2.5

	*Fixed resize error when only two slides were present
	*Updated comments for slide_link to reflect actual option ("number" to "num")
	
7/13/11 - 3.2.4

	*Slideshow files updated to 3.2.4 to address Firefox 5+ bug with slides not loading
	*Flickr fix for 1.1.2 for Flickr API and window load event conflicts (thanks to dbertram)
	*Update to Shutter CSS file to fix IE7 issue where progress bar wasn't left aligned

7/8/11 - 3.2.3

	*Fixed bug where certain transitions broke slideshow since the 3.2.2 update in Firefox and IE

7/5/11	- 3.2.2

	*Reworked Supersized slides to be insides an unordered list, rather than anchor tags
	*Slides now load upon request and populate the respective list item. Corrects potential bandwidth problem when caching is turned off, if images keep getting reloaded.
	*Only affects base slideshow files: supersized.3.2.x.js and supersized.css

6/27/11 - 3.2.1

	*Fixed Supersized loader not displaying initially (theme files unaffected)
	*Supersized project page now updated

6/20/11 - 3.2.0 Early Release
	
	*Documentation, announcement post, and project page update to follow
	*The Flickr edition is not updated from 3.1.3 yet - this is on it's way

3/15/11 - 3.1.3 Update (All editions)

	*Added fix for images on IE failing to resize when loaded (update supersized.3.1.x.js)

3/11/11 - Supersized 3.1.2 Updates (All editions)

	*Added option for random slide order
	*Updated min_height and min_width performance


3/5/11 - Supersized 3.1.1 and Supersized Flickr 1.1 Updates and Fixes

	*Smoother slide transitions (no longer uses the slide function)
	*Files "effects.core.min.js" and "effects.slide.min.js" are no longer required
	*Fixed overlapping images when sliding
	*Fixed image resizing for slideshows with only 1 image
	*Path for navigation button images is now defined in options
	*Added option for basic JS image protection against right click/dragging
	*Random start slides now possible in Slideshows (0 is random)
	*Updated default #supersized-loader CSS and animated GIF to work better on light and dark backgrounds


2/27/11 - Updates to project page and licenses
	
	*Supersized 3.1 is licensed under either the MIT or GPL License
	*Demos and documentation can now be found at the project page (http://buildinternet.com/project/supersized)


2/26/11 - Supersized 3.1 and Supersized Flickr 1.0 Released

	*Complete rewrite of the Supersized script
	*Added image rendering for faster transition speeds on FF and IE
	*Dynamic image handling (no longer relies on predefined ratios)
	*Unobtrusive backgrounds - you no longer need to wrap your content in a special div.
	*Many options added, including fit to screen, keyboard navigation, transition speed, and more.
	*Created seperate script specifically for Flickr - can pull by user, set, or group.
	*API Key is needed to use Supersized Flickr (http://www.flickr.com/services/apps/create/)

	Expect updates to the project page, demos, and a corresponding announcement post on Build Internet.

	**If you are upgrading from a previous version, the structure has changed - I will post how to go about this when I do the corresponding post.

2/11/11 - Supersized Core files updated with reduced code, cleaner file structure, and dynamic image proportions.

## Contact

- http://twitter.com/vivalasam
- sam@onemightyroar.com
