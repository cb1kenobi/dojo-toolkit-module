<?php
// $Id:

/**
 * @file
 * Dojo Subversion repository page and related functions.
 */

define('DOJO_SVN_BIN', '/usr/bin/svn');
define('DOJO_SVN_URL', 'http://svn.dojotoolkit.org/dojo');

/**
 * Defines subversion repository specific menu items.
 */
function _dojo_svn_menu(&$items, $may_cache) {
	if ($may_cache) {
		$items[] = array(
			'path' => 'admin/settings/dojo/svn',
			'title' => t('Dojo Subversion Repository'),
			'callback' => 'drupal_get_form',
			'callback arguments' => array('_dojo_svn_form'),
			'type' => MENU_LOCAL_TASK,
			'weight' => 2,
			'access' => user_access('administer Dojo')
		);

		$items[] = array(
			'path' => 'dojo/svn',
			'title' => t('Dojo SVN Handler'),
			'callback' => '_dojo_svn_folder_handler',
			'type' => MENU_CALLBACK,
			'access' => user_access('administer Dojo')
		);
	}
}

/**
 * The main entry point for the Dojo Subversion Repository page
 */
function _dojo_svn_form($form_values = NULL) {
	// if there was an error on the previous page, then short circuit this function
	if (isset($form_values) && isset($_POST) && $form_values['form_build_id'] != $_POST['form_build_id']) {
		return array();
	}

	if (!is_writable(drupal_get_path('module', 'dojo'))) {
		drupal_set_message(t('<p>The dojo module directory "/' . drupal_get_path('module', 'dojo') . '" is not writable.</p><p>In order to checkout the source code, the directory must be writable.  To enable write access in a Unix environment, execute "<code>chmod 757 ' . drupal_get_path('module', 'dojo') . '</code>" from the Drupal root.</p>'), 'error');
		return array();
	}

	$step = 1;
	if (isset($form_values) && $form_values['op'] != 'Back') {
		$step = $form_values['step'];

		// validate the last step
		switch ($form_values['step']) {
			case 1:
				$svn_bin = $_POST['dojo_svn_bin'];
				if (!file_exists($svn_bin)) {
					form_set_error('dojo_svn_bin', t('Subversion binary "' . $svn_bin . '" does not exist.'));
					break;
				}
	
				$svn_url = $_POST['dojo_svn_url'];
				$f = @file($svn_url);
				if (!$f || (!stripos(implode('', $f), 'powered by') && !stripos(implode('', $f), 'subversion'))) {
					form_set_error('dojo_svn_url', t('Dojo repository URL "' . $svn_url . '" is invalid or unable to connect to.'));
					break;
				}
	
				variable_set('dojo_svn_bin', $svn_bin);
				variable_set('dojo_svn_url', $svn_url);
				break;
	
			case 2:
				$folder = $_POST['dojo_svn_folder'];
				if (strlen(trim($folder)) == 0) {
					form_set_error('dojo_svn_folder', t('Please select a folder to checkout.'));
					break;
				}
	
				$svn_url = variable_get('dojo_svn_url', '') . $folder;
				$f = @file($svn_url);
				if (!$f || (!stripos(implode('', $f), 'powered by') && !stripos(implode('', $f), 'subversion'))) {
					form_set_error('dojo_svn_folder', t('Dojo repository URL "' . $svn_url . '" is invalid or unable to connect to.'));
				}
				break;
		}

		// if there are no errors, increment the step
		if (!form_get_errors()) {
			$step++;
		}
	}

	$form = array('#multistep' => TRUE, '#redirect' => FALSE);

	// write the current step
	$form['step'] = array(
		'#type' => 'hidden',
		'#value' => $step,
	);

	// create the fields for the current step
	switch ($step) {
		case 1:
			$form['dojo_svn_settings'] = array(
				'#type' => 'fieldset',
				'#title' => t('Subversion Settings'),
				'#description' => t('<p>Dojo provides anonymous access to their Subversion respository.  In order to checkout the source code, you must have the Subversion client software installed on this computer.  For more information, visit the <a href="http://subversion.tigris.org" target="_blank">Subversion website</a>.</p>')
			);
	
			$form['dojo_svn_settings']['dojo_svn_bin'] = array(
				'#type' => 'textfield',
				'#title' => t('Path to Subversion Binary'),
				'#default_value' => isset($form_values['dojo_svn_bin']) ? $form_values['dojo_svn_bin'] : variable_get('dojo_svn_bin',  DOJO_SVN_BIN),
				'#maxlength' => 128,
				'#required' => TRUE,
				'#description' => t('Path to the local subversion binary.  In a Unix environment, the path is typically "<code>/usr/bin/svn</code>".')
			);
		
			$form['dojo_svn_settings']['dojo_svn_url'] = array(
				'#type' => 'textfield',
				'#title' => t('Dojo Repository URL'),
				'#default_value' => isset($form_values['dojo_svn_url']) ? $form_values['dojo_svn_url'] : variable_get('dojo_svn_url', DOJO_SVN_URL),
				'#maxlength' => 128,
				'#required' => TRUE,
				'#description' => t('URL of the Dojo Subversion repository.')
			);
	
			$form['submit'] = array(
				'#please_wait' => TRUE,
				'#type' => 'submit',
				'#value' => t('Continue'),
			);
			break;

		case 2:
			$profile = _dojo_config_profiles_detect();
			$build = isset($profile['dojo_js']) ? $profile['dojo_js'] : DOJO_JS;
			
			$image_path = '/' . drupal_get_path('module', 'dojo') . '/' . substr($build, 0, strrpos($build, '/')) . '/src/widget/templates/images/TreeV3/';
			if (stripos($build, 'http') !== FALSE || (strlen($build) > 1 && !file_exists(substr($build, 1)))) {
				$image_path = str_replace('dojo.js', 'src/widget/templates/images/TreeV3/', $build);
			}

			$form['tree_icons'] = array(
				'#value' => '<div style="display:none"><img src="' . $image_path . 'i.gif"><img src="' . $image_path . 'i_half.gif"><img src="' . $image_path . 'expand_minus.gif"><img src="' . $image_path . 'expand_plus.gif"><img src="' . $image_path . 'expand_leaf.gif"><img src="' . $image_path . 'i_long.gif"><img src="' . $image_path . 'document.gif"><img src="' . $image_path . 'open.gif"><img src="' . $image_path . 'closed.gif"></div>'
			);

			$form['dojo_svn_folders'] = array(
				'#type' => 'fieldset',
				'#title' => t('Subversion Settings'),
				'#description' => t('<p>The Dojo source code is organized by directories.  The <code>trunk</code> contains the latest development code.  The selected directory will be checked out to the "/' . drupal_get_path('module', 'dojo') . '" directory.</p>')
			);

			$form['dojo_svn_folders']['dojo_svn_folder'] = array(
				'#type' => 'hidden',
				'#svnTree' => TRUE,
				'#svnData' => array('data' => _dojo_svn_execute_list())
			);

			$form['back'] = array(
				'#type' => 'submit',
				'#value' => t('Back'),
			);

			$form['submit'] = array(
				'#please_wait' => TRUE,
				'#type' => 'submit',
				'#value' => t('Checkout'),
			);
			break;

		case 3:
			$dir = $_POST['dojo_svn_folder'];
			$local_dir = getcwd() . '/' . drupal_get_path('module', 'dojo') . $dir;

			$form['dojo_svn_done'] = array(
				'#type' => 'fieldset',
				'#title' => t('Subversion Checkout Completed'),
				'#description' => t('<p>The checkout has completed and the output below should be checked for errors.</p>')
			);

			$form['dojo_svn_done']['dojo_svn_output'] = array(
				'#type' => 'item',
				'#title' => 'Subversion Output',
				'#value' => '<div class="DojoSvnOutput">' . implode('<br/>', _dojo_svn_execute_checkout($dir, $local_dir)) . '</div>'
			);
			break;
	}

	return $form;
}

/**
 * Helper class for parsing the xml response from Subversion
 */
class _dojo_svn_listing {
	function parse($data) {
		$this->listing = array();
		$this->current_item = null;
		$this->current_data = '';

		$parser = xml_parser_create();
		xml_set_object($parser, $this);
		xml_set_element_handler($parser, '_start', '_end');
		xml_set_character_data_handler($parser, '_data');
		xml_parse($parser, $data);
		xml_parser_free($parser);
	}

	function _start($parser, $tag, $attrs) {
		switch (strtolower($tag)) {
			case 'commit':
				if ($this->current_item)
					$this->current_item->revision = strtolower($attrs['REVISION']);
				break;
			case 'entry':
				$this->current_item = new StdClass;
				$this->current_item->type = strtolower($attrs['KIND']);
				break;
		}
	}

	function _end($parser, $tag) {
		if (!$this->current_item)
			return;

		$tag = strtolower($tag); 

		switch ($tag) {
			case 'commit':
				break;
			case 'date':
				list($time) = explode('.', $this->current_data);
				$t = strtotime($time);
				$zone = intval(date("O")) / 100;
				$t += $zone * 60 * 60;
				$this->current_item->date = date('F j, Y, g:i a', $t);
				break;
			case 'entry':
				$this->listing[] = $this->current_item;
				$this->current_item = null;
				break;
			default:
				$this->current_item->$tag = $this->current_data;
				break;
		}
		$this->current_data = '';
	}

	function _data($parser, $data) {
		if ($this->current_item)
			$this->current_data .= $data;
	}
}

/**
 * Executes the svn binary and returns a listing of the specified directory
 */
function _dojo_svn_execute_list($dir = '/') {
	$cmd = array(
		variable_get('dojo_svn_bin',  DOJO_SVN_BIN),
		'ls',
		'--non-interactive',
		'--xml'
	);

	$url = variable_get('dojo_svn_url',  DOJO_SVN_URL);
	if (substr($url, -1, 1) == '/' && substr($dir, 0, 1) == '/') {
		$url = substr($url, 0, strlen($url) - 1);
	} else if (substr($url, -1, 1) != '/' && substr($dir, 0, 1) != '/') {
		$url .= '/';
	}
	$cmd[] = escapeshellarg($url . $dir);
	$cmd[] = "2>&1";

	exec(implode(' ', $cmd), $output);

	$svn_list = new _dojo_svn_listing();
	$svn_list->parse(implode('', $output));

	return $svn_list->listing;
}

/**
 * Executes the svn binary and checks out the repository in the specified directory
 */
function _dojo_svn_execute_checkout($dir, $local_dir) {
	// don't allow root for safety
	if ($dir == '/')
		return;

	$cmd = array(
		variable_get('dojo_svn_bin',  DOJO_SVN_BIN),
		'co',
		'--non-interactive'
	);

	$url = variable_get('dojo_svn_url',  DOJO_SVN_URL);
	if (substr($url, -1, 1) == '/' && substr($dir, 0, 1) == '/') {
		$url = substr($url, 0, strlen($url) - 1);
	} else if (substr($url, -1, 1) != '/' && substr($dir, 0, 1) != '/') {
		$url .= '/';
	}
	$cmd[] = escapeshellarg($url . $dir);
	$cmd[] = escapeshellarg($local_dir);
	$cmd[] = "2>&1";

	exec(implode(' ', $cmd), $output);

	return $output;
}

/**
 * Helper function to hack out the expanded node's objectId.
 */
function _dojo_parse_svn_objectid($json) {
	// $json looks like this:
	// {"node":{"widgetId":"dojo_TreeNodeV3_3","objectId":"dojox","index":3},"tree":{"widgetId":"dojo_TreeV3_0","objectId":""}}
	$p = strpos($json, 'objectId') + 11;
	$q = strpos($json, '"', $p);
	return substr($json, $p, $q - $p);
}

/**
 * Ajax handler for the folder tree
 */
function _dojo_svn_folder_handler() {
	switch ($_GET['action']) {
		case 'getChildren':
			$objectId = _dojo_parse_svn_objectid($_GET['data']);
			if (strlen($objectId)) {
				echo '(' . drupal_to_js(_dojo_svn_execute_list($objectId)) . ')';
				break;
			}
		default:
			echo '([])';
	}

	exit();
}
