Param(
    $ProjectDir,
    $ConfigurationName,
    $TargetDir,
    $TargetFileName,
	$TargetName)

echo 'Starting Post Build Script'

echo 'executing grunt'
grunt

<#
if($ConfigurationName -eq 'Debug'){
# 'launch default browser to test output'
$url=$Pwd.Path+"\test\NetJS.JS.Lib.html"
start $url
}#>

echo 'Completed Post Build Script'