<?php
namespace TYPO3\Z3Map\Utility;

/***************************************************************
 *  Copyright notice
 *
 *  (c) 2014 Sven Külpmann <sven.kuelpmann@lenz-wie-fruehling.de>, lenz wie frühling
 *  
 *  All rights reserved
 *
 *  This script is part of the TYPO3 project. The TYPO3 project is
 *  free software; you can redistribute it and/or modify
 *  it under the terms of the GNU General Public License as published by
 *  the Free Software Foundation; either version 3 of the License, or
 *  (at your option) any later version.
 *
 *  The GNU General Public License can be found at
 *  http://www.gnu.org/copyleft/gpl.html.
 *
 *  This script is distributed in the hope that it will be useful,
 *  but WITHOUT ANY WARRANTY; without even the implied warranty of
 *  MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 *  GNU General Public License for more details.
 *
 *  This copyright notice MUST APPEAR in all copies of the script!
 ***************************************************************/

/**
 *
 *
 * @package z3_map
 * @license http://www.gnu.org/licenses/gpl.html GNU General Public License, version 3 or later
 *
 */
class Assets {
	
	public function addAssets($settings){
		
		$businessClientID ='';
		if($settings['map']['businessClientID'])
			$businessClientID = '&client=gme-'.$settings['map']['businessClientID'];
		$language = '';
		if($settings['map']['localize'] > 0)
			$language = '&language='.$GLOBALS['TSFE']->sys_language_uid;
		// JS
		if($settings['includeJsInFooter']){
			if ($settings['jQueryLib']){
				$GLOBALS['TSFE']->getPageRenderer()->addJsFooterLibrary('tx_z3map_jquery', $settings['jQueryLib'], 'text/javascript', FALSE, FALSE, '', TRUE);
			}
			if ($settings['map']['mapLibDraw']){
				
				$GLOBALS['TSFE']->getPageRenderer()->addJsFooterLibrary('tx_z3map_maplib', $settings['map']['mapLibDraw'], 'text/javascript', FALSE, FALSE, '', TRUE);
			}
			if ($settings['map']['markerMgntLib']){
				$GLOBALS['TSFE']->getPageRenderer()->addJsFooterLibrary('tx_z3map_mapmarkermanagement', $GLOBALS['TSFE']->tmpl->getFileName($settings['map']['markerMgntLib']), 'text/javascript', FALSE, FALSE, '', TRUE);
			}
			if ($settings['map']['markerClstrLib']){
				$GLOBALS['TSFE']->getPageRenderer()->addJsFooterLibrary('tx_z3map_mapmarkercluster', $GLOBALS['TSFE']->tmpl->getFileName($settings['map']['markerClstrLib']), 'text/javascript', FALSE, FALSE, '', TRUE);
			}
			$GLOBALS['TSFE']->getPageRenderer()->addJsFooterFile($GLOBALS['TSFE']->tmpl->getFileName($settings['map']['jsFile']), 'text/javascript', FALSE, FALSE, '', TRUE);
		}else{
			if ($settings['jQueryLib']){
				$GLOBALS['TSFE']->getPageRenderer()->addJsLibrary('tx_z3map_jquery', $settings['jQueryLib'], 'text/javascript', FALSE, FALSE, '', TRUE);
			}
			if ($settings['map']['mapLibDraw']){
				$GLOBALS['TSFE']->getPageRenderer()->addJsLibrary('tx_z3map_maplib', $settings['map']['mapLibDraw'], 'text/javascript', FALSE, FALSE, '', TRUE);
			}
			if ($settings['map']['markerClstrLib']){
				$GLOBALS['TSFE']->getPageRenderer()->addJsLibrary('tx_z3map_mapmarkercluster', $GLOBALS['TSFE']->tmpl->getFileName($settings['map']['markerClstrLib']), 'text/javascript', FALSE, FALSE, '', TRUE);
			}
			if ($settings['map']['markerMgntLib']){
				$GLOBALS['TSFE']->getPageRenderer()->addJsLibrary('tx_z3map_mapmarkermanagement', $GLOBALS['TSFE']->tmpl->getFileName($settings['map']['markerMgntLib']), 'text/javascript', FALSE, FALSE, '', TRUE);
			}
			$GLOBALS['TSFE']->getPageRenderer()->addJsFile($GLOBALS['TSFE']->tmpl->getFileName($settings['map']['jsFile']), 'text/javascript', FALSE, FALSE, '', TRUE);
		}
//		// CSS
		if($settings['map']['cssFile']){
			$GLOBALS['TSFE']->getPageRenderer()->addCssFile($GLOBALS['TSFE']->tmpl->getFileName($settings['map']['cssFile']), 'stylesheet', 'all', '', FALSE);
		}
	}
}	
	 
?>