<?php
if (!defined('TYPO3_MODE')) {
	die ('Access denied.');
}

\TYPO3\CMS\Extbase\Utility\ExtensionUtility::configurePlugin(
	'TYPO3.' . $_EXTKEY,
	'Map',
	array(
		'Poi' => 'map, route, search',
		
	),
	// non-cacheable actions
	array(
		'Poi' => 'infoWindow',
		
	)
);

// call postprocessing when saving Partners
//$GLOBALS['TYPO3_CONF_VARS']['SC_OPTIONS']['t3lib/class.t3lib_tcemain.php']['processDatamapClass'][] = 
//	'EXT:z3_map/Classes/Utility/TceMainProcDm.php:TceMainProcDm';
$GLOBALS ['TYPO3_CONF_VARS']['SC_OPTIONS']['t3lib/class.t3lib_tcemain.php']['processDatamapClass'][$_EXTKEY] = 'TYPO3\Z3Map\Hook\TCEmainHook';
$GLOBALS ['TYPO3_CONF_VARS']['SC_OPTIONS']['t3lib/class.t3lib_tcemain.php']['processCmdmapClass'][$_EXTKEY] = 'TYPO3\Z3Map\Hook\TCEmainHook';
?>