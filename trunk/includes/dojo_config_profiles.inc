<?php
// $Id:

/**
 * @file
 * Dojo config profiles related functions.
 */

define('DOJO_JS', 'http://o.aolcdn.com/dojo/0.4.2/dojo.js');

// Array of all xdomain hosting providers
global $dojo_xdomain_urls;
$dojo_xdomain_urls = array('http://o.aolcdn.com/dojo/0.4.2/dojo.js' => 'AOL\'s Content Delivery Network (CDN) Dojo 0.4.2');

/**
 * Defines config profiles specific menu items.
 */
function _dojo_config_profiles_menu(&$items, $may_cache) {
	if ($may_cache) {
		$items[] = array(
			'path' => 'dojo/config',
			'title' => t('Dojo Config Handler'),
			'callback' => '_dojo_config_profiles_config_handler',
			'type' => MENU_CALLBACK,
			'access' => TRUE
		);
	}
}

/**
 * Loads all profiles or a specific profile.
 */
function _dojo_config_profiles_load($profile_name = NULL) {
	$results = db_query('SELECT P.name, P.weight, P.settings, R.rid FROM {dojo_config_profiles} P JOIN {dojo_config_roles} R ON P.name = R.name' . ($profile_name ? " WHERE P.name = '" . $profile_name . "'" : '') . ' ORDER BY P.weight');
	$profiles = array();
	while ($data = db_fetch_object($results)) {
		if (!isset($profiles[$data->name])) {
			$profiles[$data->name] = unserialize($data->settings);
			$profiles[$data->name]['rids'] = array();
		}
		$profiles[$data->name]['rids'][] = $data->rid;
	}

	if ($profile_name) {
		return $profiles[$profile_name];
	}
	return $profiles;
}

/**
 * The form used for creating and editing config profiles.
 */
function _dojo_config_profiles_list(&$form) {
	$form['config_profiles'] = array(
		'#type' => 'fieldset',
		'#title' => t('Dojo Config Profiles'),
		'#description' => t('<p>Config profiles allow you to associate Dojo configurations to specific pages, fields, and access roles.</p><p><a href="/admin/settings/dojo/config/add">Add new config profile</a></p>')
	);

	$profiles = _dojo_config_profiles_load();
	if ($profiles) {
		$roles = user_roles();
		$header = array(t('Profile'), t('Load jQuery?'), t('Local Build?'), t('Debug On?'), t('Roles'), t('Operations'));
		$rows = array();

		foreach ($profiles as $p) {
			$selected_roles = array();
			foreach ($p['rids'] as $rid) {
				$selected_roles[] = $roles[$rid];
			}
			$rows[] = array(
				array('data' => $p['name'], 'valign' => 'top'),
				array('data' => ($p['loadjQuery'] == 1 ? 'yes' : 'no'), 'valign' => 'top'),
				array('data' => (stripos($p['dojo_js'], 'http') !== FALSE ? 'no' : 'yes'), 'valign' => 'top'),
				array('data' => ($p['is_debug'] == 1 ? 'yes' : 'no'), 'valign' => 'top'),
				array('data' => implode("<br/>\n", $selected_roles), 'valign' => 'top'),
				array('data' => l(t('edit'), 'admin/settings/dojo/config/edit/'. urlencode($p['name'])) . ' '. l(t('delete'), 'admin/settings/dojo/config/delete/'. urlencode($p['name'])), 'valign' => 'top')
			);
		}

		$form['config_profiles']['config_profile_list'] = array(
			'#value' => theme('table', $header, $rows)
		);
	} else {
		global $dojo_xdomain_urls;
		$form['config_profiles']['no_config_profiles'] = array(
			'#value' => t('<div class="messages status"><p>No config profiles found.</p><p>A default profile will be used for all access roles where the following settings are applied:<ul><li>Load both Dojo and jQuery</li><li>Dojo build: $dojo_js</li><li>Enable debugging: <em>False</em></li><li>Debug at all costs: <em>False</em></li><li>Parse widgets: <em>False</em></li></ul></p></div>', array('$dojo_js' => $dojo_xdomain_urls[DOJO_JS]))
		);
	}
}

/**
 * Renders the config profiles form.
 */
function _dojo_config_profiles_form(&$form, $action = 'add', $profile_name = NULL) {
	$op = $_POST['op'];
	$op = $action && !$op ? $action : $op;
	$profile = $_POST;

	switch ($op) {
		case t('Create profile'):
		case t('Update profile'):
			if (!$profile['name']) {
				form_set_error('name', 'You must enter a profile name.');
			}
			if (!$profile['rids']) {
				form_set_error('rids', 'You must select at least on access role.');
			}

			if (!form_get_errors()) {
				db_query("DELETE FROM {dojo_config_profiles} WHERE name = '%s' or name = '%s'", $profile['name'], $profile['previous_name']);
				db_query("DELETE FROM {dojo_config_roles} WHERE name = '%s' or name = '%s'", $profile['name'], $profile['previous_name']);

				// capture some values before we nuke unneeded variables
				$updating = isset($profile['op']) && $profile['op'] == t('Update profile');
				$rids = $profile['rids'];
				unset($profile['submit'], $profile['form_id'], $profile['op'], $profile['form_token'], $profile['previous_name'], $profile['rids']);

				db_query("INSERT INTO {dojo_config_profiles} (name, weight, settings) VALUES ('%s', %s, '%s')", $profile['name'], $profile['weight'], serialize($profile));
				foreach ($rids as $rid => $value) {
					db_query("INSERT INTO {dojo_config_roles} (name, rid) VALUES ('%s', %d)", $profile['name'], $rid);
				}

				drupal_set_message(t('The config profile has been successfully ' . ($updating ? 'updated.' : 'created.')));
				drupal_goto('admin/settings/dojo');
				break;
			}

		case 'add':
		case 'edit':
			if ($action == 'edit' && $profile_name) {
				$profile = _dojo_config_profiles_load($profile_name);
				_dojo_profiles_set_breadcrumbs('admin/settings/dojo/config/edit', 'Update Dojo Config Profile');
			} else {
				_dojo_profiles_set_breadcrumbs('admin/settings/dojo/config/add', 'Add Dojo Config Profile');
			}

			$saveButton = 'Create profile';

			if ($action == 'edit') {
				$saveButton = 'Update profile';
				$form['previous_name'] = array(
					'#type' => 'hidden',
					'#value' => $profile['name']
				);
			}

			$form['revision'] = array(
				'#type' => 'hidden',
				'#value' => isset($profile['revision']) ? $profile['revision'] + 1 : 1
			);

			$form['help'] = array(
				'#value' => t('<p>Config profiles allow you to associate Dojo configurations to specific pages, fields, and access roles.</p>')
			);

			$form['general'] = array(
				'#type' => 'fieldset',
				'#title' => t('General Information'),
				'#collapsible' => TRUE
			);

			$form['general']['name'] = array(
				'#type' => 'textfield', 
				'#title' => t('Profile name'), 
				'#default_value' => $profile['name'],
				'#maxlength' => 128, 
				'#required' => TRUE, 
				'#description' => t('Enter a unique name that identifies the profile.')
			);

			$form['access_roles'] = array(
				'#type' => 'fieldset',
				'#title' => t('Access Roles'),
				'#description' => t('You can select the access roles that have access to this profile. Multiple profiles can be associated to the same access role, however the profile with the lowest weight will be applied first.'),
				'#collapsible' => TRUE
			);

			$roles = user_roles();
			$form['access_roles']['rids'] = array(
				'#type' => 'checkboxes',
				'#title' => t('Roles allowed to use this profile'),
				'#default_value' => $profile['rids'],
				'#options' => $roles,
				'#required' => TRUE,
				'#description' =>  t('Check at least one role.')
			);

			$form['access_roles']['weight'] = array(
				'#type' => 'weight',
				'#title' => t('Access Weight'),
				'#default_value' => $profile['weight'],
				'#description' =>  t('Weight of this access role.')
			);

			$form['toolkits'] = array(
				'#type' => 'fieldset',
				'#title' => t('Toolkit Loading'),
				'#description' => t('<p>By default, Drupal uses a Javascript library called <a href="http://jquery.com" target="_blank">jQuery</a>.  By enabling this Dojo module, most areas that use jQuery in the default Drupal installion will be updated to use Dojo instead.  Since loading both Dojo and jQuery can raise performance issues, it may be best to only use Dojo.  However, installed modules that are outside the default set may still use jQuery and may not function properly if only using Dojo.</p>'),
				'#collapsible' => TRUE
			);

			$form['toolkits']['loadjQuery'] = array(
				'#type' => 'radios',
				'#title' => t('Load jQuery'),
				'#default_value' => isset($profile['loadjQuery']) ? $profile['loadjQuery'] : 1,
				'#options' => array(t('Only load Dojo'), t('Load both Dojo and jQuery')),
				'#description' => t('<p>Note: There are some areas that use jQuery and cannot be updated to use Dojo.  If you choose to only load Dojo, then jQuery will be automatically loaded on those pages which require jQuery.</p>')
			);

			$form['build'] = array(
				'#type' => 'fieldset',
				'#title' => t('Dojo Build'),
				'#description' => t('<p>Dojo\'s source can be compiled into a build containing only the packages that you need. There are several pre-compiled builds that vary on the included packages.  You can make your own build on the <a href="/admin/settings/dojo/build">Create Custom Build</a> page.</p>'),
				'#collapsible' => TRUE
			);

			global $dojo_xdomain_urls;
			$builds = array('Local Builds' => _dojo_config_profiles_scan_build_dirs(), 'XDomain Builds' => $dojo_xdomain_urls);

			if (!count($builds['Local Builds'])) {
				$desc = '<p>NOTE: No local Dojo builds found.  There are circumstances where you may want to host the Dojo Javascript files on this server.  You can download a Dojo build from <a href="http://download.dojotoolkit.org" target="_blank">http://download.dojotoolkit.org</a>.  It is recommended to use the <a href="http://download.dojotoolkit.org/release-0.4.2/dojo-0.4.2-editor.tar.gz">Dojo 0.4.2 Editor</a> build.</p>';
			}

			$form['build']['dojo_js'] = array(
				'#type' => 'select',
				'#title' => t('Build'),
				'#default_value' => isset($profile['dojo_js']) ? $profile['dojo_js'] : DOJO_JS,
				'#options' => $builds,
				'#description' => t($desc)
			);

			$form['djconfig'] = array(
				'#type' => 'fieldset',
				'#title' => t('Dojo Configuration'),
				'#description' => t('The following Dojo options are used to set the "<code>djConfig</code>" Javascript variable.'),
				'#collapsible' => TRUE
			);

			$form['djconfig']['is_debug'] = array(
				'#type' => 'radios',
				'#title' => t('Debug'),
				'#default_value' => isset($profile['is_debug']) ? $profile['is_debug'] : 0,
				'#options' => array(t('Disabled'), t('Enabled')),
				'#description' => t('Displays Dojo debug messages.'),
			);

			$form['djconfig']['debug_at_all_costs'] = array(
				'#type' => 'radios',
				'#title' => t('Debug At All Costs'),
				'#default_value' => isset($profile['debug_at_all_costs']) ? $profile['debug_at_all_costs'] : 0,
				'#options' => array(t('Disabled'), t('Enabled')),
				'#description' => t('Changes the way the Dojo\'s packaging system loads packages.  May be helpful when debugging Mozilla based browsers. Visit <a href="' . DOJO_URL_DEBUGGING . '" target="_blank">Debugging Javascript</a> for more information.'),
			);

			$form['djconfig']['parse_widgets'] = array(
				'#type' => 'radios',
				'#title' => t('Parse Widgets'),
				'#default_value' => isset($profile['parse_widgets']) ? $profile['parse_widgets'] : 0,
				'#options' => array(t('Disabled'), t('Enabled')),
				'#description' => t('Tells Dojo to scan the DOM tree for widget placeholders.  Disabling the parser will speed up the page load time, but only widgets instantiated via dojo.widget.createWidget() will be created.'),
			);

			$form['djconfig']['google_map_key'] = array(
				'#type' => 'textarea',
				'#googleMapKeyTable' => TRUE,
				'#title' => t('Google Map Key'),
				'#default_value' => isset($profile['google_map_key']) ? $profile['google_map_key'] : '',
				'#maxlength' => 255,
				'#description' => t('In order for the Google Map to work, you must <a href="http://www.google.com/apis/maps/signup.html" target="_blank">sign up for the Google Maps API</a>.  Each Google Map key is tied to a URL.  You may enter multiple URLs and their corresponding key.')
			);

			$form['buttons']['submit'] = array(
				'#type' => 'submit',
				'#value' => t($saveButton)
			);
			break;

		case 'delete':
			db_query("DELETE FROM {dojo_config_profiles} WHERE name = '%s'", $profile_name);
			db_query("DELETE FROM {dojo_config_roles} WHERE name = '%s'", $profile_name);
			drupal_set_message('The config profile has been successfully deleted.');
			drupal_goto('admin/settings/dojo');
			break;
	}
}

/**
 * Scans the dojo module directory and sites folders for dojo builds.
 */
function _dojo_config_profiles_scan_build_dirs() {
	return array_merge(
		_dojo_config_profiles_scan_builds_helper(drupal_get_path('module', 'dojo'), 3),
		_dojo_config_profiles_scan_builds_helper('sites/all', 3),
		_dojo_config_profiles_scan_builds_helper(conf_path(), 3)
	);
}

/**
 * Helper function for finding the dojo builds.
 */
function _dojo_config_profiles_scan_builds_helper($path, $depth) {
	$builds = array();
	if ($depth > 0 && $dir = opendir($path)) {
		// search files first
		$match = FALSE;
		while ($file = readdir($dir)) {
			$full_path = $path . '/' . $file;
			if (is_file($full_path) && ereg('dojo.*\.js', $file)) {
				$builds['/' . $full_path] = '/' . $full_path;
				$match = TRUE;
			}
		}

		// if we don't find any dojo files, then start scanning sub-directories
		if (!$match) {
			rewinddir($dir);
			while ($file = readdir($dir)) {
				$full_path = $path . '/' . $file;
				if (!$match && $file[0] != '.' && is_dir($full_path)) {
					$builds = array_merge($builds, _dojo_config_profiles_scan_builds_helper($full_path, $depth - 1));
				}
			}
		}
		closedir($dir);
	}
	return $builds;
}

/**
 * Scans the sites folders for dojo module paths.
 */
function _dojo_config_profiles_scan_module_dirs() {
	return array_merge(
		_dojo_config_profiles_scan_module_helper('sites/all'),
		_dojo_config_profiles_scan_module_helper(conf_path())
	);
}

/**
 * Helper function for finding the dojo modules.
 */
function _dojo_config_profiles_scan_module_helper($path) {
	$modules = array();
	if ($sites_dir = opendir($path)) {
		// search each folder in the site root
		while ($folder = readdir($sites_dir)) {
			$full_path = $path . '/' . $folder;
			if (is_dir($full_path) && $file[0] != '.' && $module_dir = opendir($full_path)) {
				while ($file = readdir($module_dir)) {
					if (is_file($full_path . '/' . $file) && $file == '.dojo' && $file != 'drupal' && $file != 'dojo' && !isset($modules[$folder])) {
						$modules[$folder] = $full_path;
					}
				}
				closedir($module_dir);
			}
		}
		closedir($sites_dir);
	}
	return $modules;
}

/**
 * Loads the config profile based on the current user's access
 */
function _dojo_config_profiles_detect() {
	static $profile = NULL;

	if (!$profile) {
		global $user;
		$results = db_query('SELECT P.name, P.settings FROM {dojo_config_profiles} P JOIN {dojo_config_roles} R ON P.name = R.name AND R.rid IN (%s) ORDER BY P.weight LIMIT 1', implode(',', array_keys($user->roles)));
		if ($data = db_fetch_object($results)) {
			$profile = unserialize($data->settings);
		}
	}

	return $profile;
}

/**
 * Builds the Dojo config.
 */
function _dojo_config_profiles_config_handler() {
	$profile = _dojo_config_profiles_detect();

	$dojo_js = isset($profile['dojo_js']) ? $profile['dojo_js'] : DOJO_JS;
	$dojo_module_path = drupal_get_path('module', 'dojo');

	// set the headers
	header('Expires: ' . gmdate('D, d M Y H:i:s', time() + (24 * 60 * 60)) . ' GMT');
	header('Cache-Control: max-age=3600, must-revalidate');
	header('Content-type: text/javascript');

	// render the host
	echo 'var host=location.protocol+"//"+location.host;';

	// render the djConfig
	echo 'var djConfig = {modulePaths:{"dojo":"' . substr($dojo_js, 0, strrpos($dojo_js, '/')) . '/src",';
	echo '"drupal":host+"/' . $dojo_module_path . '/drupal"';

	// scan the site folder for any dojo module paths we should include
	foreach (_dojo_config_profiles_scan_module_dirs() as $folder => $full_path) {
		echo ',"' . $folder . '":host+"/' . $full_path . '"';
	}

	echo '}';
	echo ',dojoRichTextFrameUrl:host+"/' . $dojo_module_path . '/drupal/richtextframe.html"';
	echo ',dojoCreateLinkUrl:host+"/' . $dojo_module_path . '/drupal/createlink.html"';
	echo ',dojoInsertImageUrl:host+"/' . $dojo_module_path . '/drupal/insertimage.html"';

	if (isset($profile['is_debug']) && $profile['is_debug'] == 1) {
		echo ',isDebug:true';
	}
	if (isset($profile['debug_at_all_costs']) && $profile['debug_at_all_costs'] == 1) {
		echo ',debugAtAllCosts:true';
	}
	if (isset($profile['parse_widgets']) && $profile['parse_widgets'] == 1) {
		echo ',parseWidgets:false';
	}
	if (isset($profile['google_map_key']) && strlen($profile['google_map_key'])) {
		$doc = $_SERVER['HTTP_HOST'] . $_SERVER['SCRIPT_NAME'];
		$keys = explode('|', $profile['google_map_key']);
		for ($i = 0; $i < count($keys); $i++) {
			$p = strrpos($keys[$i], ',');
			$key = substr($keys[$i], 0, $p);
			$url = substr($keys[$i], $p + 1);
			if (ereg('.*' . $url . '.*', $doc)) {
				echo ',googleMapKey:"' . $key . '"';
				break;
			}
		}
	}
	echo '};';

	exit();
}
