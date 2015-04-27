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
class Geocoding{


        static private $url = "http://maps.google.com/maps/api/geocode/json?sensor=false&language=de&address=";
		/**
		 * Location by Address returns array with lat/lng if successfull
		 * @param type $address
		 * @return array|boolean
		 */
        static public function getLocation($address){
            $url = self::$url.urlencode($address);
           
            $resp_json = self::curl_file_get_contents($url);
            $resp = json_decode($resp_json, true);

            if($resp['status']='OK'){
                return $resp['results'][0]['geometry']['location'];
            }else{
                return false;
            } 
        }

		/**
		 * 
		 * @param type $URL
		 * @return boolean
		 */
        static private function curl_file_get_contents($URL){
            $c = curl_init();
            curl_setopt($c, CURLOPT_RETURNTRANSFER, 1);
            curl_setopt($c, CURLOPT_URL, $URL);
            $contents = curl_exec($c);
            curl_close($c);

            if ($contents) return $contents;
                else return FALSE;
        }
		
}
?>
