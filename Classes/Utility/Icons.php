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
class Icons {
	
	public function buildIconConfig($settings){
		if( $settings['map']['useClustering'] == 1 && $settings['map']['cluster']['icon']['url'] != '' ){
			$settings['map']['cluster']['icon']['url'] = $GLOBALS['TSFE']->tmpl->getFileName($settings['map']['cluster']['icon']['url']);
//			$settings['map']['cluster']['icon']['size'] = $settings['map']['cluster']['icon']['size'];
//			if($settings['map']['cluster']['shadow']['url']){
//				$settings['map']['cluster']['shadow']['url'] = $GLOBALS['TSFE']->tmpl->getFileName($settings['map']['cluster']['shadow']['url']);
//			}else{
//				$settings['map']['cluster']['shadow'] = array();
//			}
//		}else{
//			$settings['map']['cluster'] = null;
		}
		
		
		if($settings['map']['marker']['icon']['url'] != ''){
			$settings['map']['marker']['icon']['url'] = $GLOBALS['TSFE']->tmpl->getFileName($settings['map']['marker']['icon']['url']);
//			if($settings['map']['marker']['shadow']['url']){
//				$settings['map']['marker']['shadow']['url'] = $GLOBALS['TSFE']->tmpl->getFileName($settings['map']['marker']['shadow']['url']);
//			}else{
//				$settings['map']['marker']['shadow'] = array();
//			}
//			$settings['map']['marker']['icon']['size']['height'] = intval($settings['map']['marker']['icon']['size']['height']);
//			$settings['map']['marker']['icon']['size']['width'] = intval($settings['map']['marker']['icon']['size']['width']);
//			$settings['map']['marker']['icon']['anchor']['x'] = intval($settings['map']['marker']['icon']['anchor']['x']);
//			$settings['map']['marker']['icon']['anchor']['y'] = intval($settings['map']['marker']['icon']['anchor']['y']);
		}else{
//			$settings['map']['marker'] = null;
		}
		
		return $settings;
	}
}	
	 
?>