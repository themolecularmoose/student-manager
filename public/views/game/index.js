/* jshint ignore:start */
var unityObjectUrl = "http://webplayer.unity3d.com/download_webplayer-3.x/3.0/uo/UnityObject2.js";
if (document.location.protocol === 'https:') {
  unityObjectUrl = unityObjectUrl.replace("http://", "https://ssl-");
}
document.write('<script type="text\/javascript" src="' + unityObjectUrl + '"><\/script>');
var config = {
  width: 960, 
  height: 600,
  params: { enableDebugging:"0" }
};
/* jshint ignore:end */
