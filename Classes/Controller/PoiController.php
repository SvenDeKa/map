<?php
namespace TYPO3\Z3Map\Controller;

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
class PoiController extends \TYPO3\CMS\Extbase\Mvc\Controller\ActionController {

	
	/**
	 * poiRepository
	 *
	 * @var \TYPO3\Z3Map\Domain\Repository\PoiRepository
	 * @inject
	 */
	protected $poiRepository;
	
	/**
	 * action list
	 *
	 * @return void
	 */
	public function listAction() {
		$pois = $this->poiRepository->findAll();
		$this->view->assign('pois', $pois);
	}

	/**
	 * action map
	 *
	 * @return void
	 */
	public function mapAction() {
		$assets = \TYPO3\CMS\Core\Utility\GeneralUtility::makeInstance('TYPO3\Z3Map\Utility\Assets');
		$assets->addAssets($this->settings);
		
		if($this->settings['map']['outsourcePoiJson'] != 1){
			$pois = $this->poiRepository->findAll();
			$this->view->assign('pois', $this->pois2Json($pois));
		}
		
		
		// the following worked for another ext, but seems to be buggy due to a bug in json_encode
		
//		\TYPO3\CMS\Extbase\Utility\DebuggerUtility::var_dump( $this->settings['map']['marker'] );
//		
//		$icons = \TYPO3\CMS\Core\Utility\GeneralUtility::makeInstance('TYPO3\Z3Map\Utility\Icons');
//		$this->settings = $icons->buildIconConfig($this->settings);
//		$this->settings['map']['marker'] = htmlspecialchars_decode( json_encode($this->settings['map']['marker']) ) ;
//		$this->settings['map']['cluster'] = htmlspecialchars_decode( json_encode($this->settings['map']['cluster']) );

//		$this->view->assign('settings', $this->settings);
	}

	/**
	 * action route
	 *
	 * @return void
	 */
	public function routeAction() {

	}

	/**
	 * action search
	 *
	 * @return void
	 */
	public function searchAction() {

	}

	/**
	 * action jsonlist
	 *
	 * @return void
	 */
	public function jsonlistAction() {
		$pois = $this->poiRepository->findAll();

		return $this->pois2Json($pois);

	}

	/**
	 * action infoWindow
	 *
	 * @return void
	 */
	public function infoWindowAction(\TYPO3\Z3Map\Domain\Model\Poi $poi) {
		$this->view->assign('poi', $poi);
	}

	
	private function pois2Json($pois){
		
		if(!is_array($pois)){
			foreach ($pois as $poi) {
				$array[] = array(
					'uid' => $poi->getUid(),
					'lat' => $poi->getLat(),
					'lng' => $poi->getLng(),
					'name' => $poi->getName(),
					'description' => $poi->getDescription(),
					'address' => $poi->getAddress(),
					'postalcode' => $poi->getPostalcode(),
					'city' => $poi->getCity(),
					'country'  => $poi->getCountry(),
				);
			}
		
		}else{
			foreach ($pois as $poi) {
				$array[] = array(
					'uid' => $poi['uid'],
					'lat' => $poi['lat'],
					'lng' => $poi['lng'],
					'name' => $poi['name'],
					'description' => $poi['description'],
					'address' => $poi['address'],
					'postalcode' => $poi['postalcode'],
					'city' => $poi['city'],
					'country' => $poi['country'],
				);
			}
		}
		return json_encode($array);
	}
}
?>