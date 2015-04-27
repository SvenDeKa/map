<?php
namespace TYPO3\Z3Map\Hook;

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
class TceMainHook{   
	
	function processDatamap_postProcessFieldArray ($status, $table, $id, &$fieldArray, &$reference){ 
		
		if ($table == 'tx_z3map_domain_model_poi'){
			
			if( $fieldArray['postalcode'] != '' ||  $fieldArray['city'] != '' || $fieldArray['address'] != ''  ) {

				$address = $fieldArray['address'].', '.$fieldArray['postalcode'].' '.$fieldArray['city'].', '.$fieldArray['country'];

				$geocoding = \TYPO3\CMS\Core\Utility\GeneralUtility::makeInstance('TYPO3\Z3Map\Utility\Geocoding');
				$latLng = $geocoding->getLocation($address);
				$fieldArray['lat'] = $latLng['lat'];
				$fieldArray['lng'] = $latLng['lng'];
			}
		}
	}
	
}

?>
