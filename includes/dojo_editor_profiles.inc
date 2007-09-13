<?php
// $Id:

/**
 * @file
 * Dojo editor profiles related functions.
 */

define('DOJO_DEFAULT_EDITOR_PAGES', "node*\nuser/*\ncomment/*\nadmin/build/block/*");
define('DOJO_DEFAULT_EDITOR_IGNORE_TEXTAREAS', "access_pages\ncaption\ndescription\nignore_textareas\nimg_assist_pages\nlog\npages\nsynonyms\nuser_mail_approval_body\nuser_mail_pass_body\nuser_mail_welcome_body");
define('DOJO_DEFAULT_EDITOR_TOOLBAR', '1,2,0,3,4,5,0,6,7,8,9,0,10,11,12,13,0,14,15,16,17,0,18');

// Array of all available toolbar buttons
global $dojo_toolbar_plugins;
$dojo_toolbar_plugins = array(
	array('description' => 'Separator', 'plugin' => '|', 'separator' => TRUE),
	array('description' => 'Undo', 'plugin' => 'undo', 'class' => 'dijitEditorIconUndo'),
	array('description' => 'Redo', 'plugin' => 'redo', 'class' => 'dijitEditorIconRedo'),
	array('description' => 'Cut', 'plugin' => 'cut', 'class' => 'dijitEditorIconCut'),
	array('description' => 'Copy', 'plugin' => 'copy', 'class' => 'dijitEditorIconCopy'),
	array('description' => 'Paste', 'plugin' => 'paste', 'class' => 'dijitEditorIconPaste'),
	array('description' => 'Bold', 'plugin' => 'bold', 'class' => 'dijitEditorIconBold'),
	array('description' => 'Italic', 'plugin' => 'italic', 'class' => 'dijitEditorIconItalic'),
	array('description' => 'Underline', 'plugin' => 'underline', 'class' => 'dijitEditorIconUnderline'),
	array('description' => 'Strikethrough', 'plugin' => 'strikethrough', 'class' => 'dijitEditorIconStrikethrough'),
	array('description' => 'Numbered List', 'plugin' => 'insertOrderedList', 'class' => 'dijitEditorIconInsertOrderedList'),
	array('description' => 'Bullet List', 'plugin' => 'insertUnorderedList', 'class' => 'dijitEditorIconInsertUnorderedList'),
	array('description' => 'Indent', 'plugin' => 'indent', 'class' => 'dijitEditorIconIndent', 'unselectable' => TRUE),
	array('description' => 'Outdent', 'plugin' => 'outdent', 'class' => 'dijitEditorIconOutdent', 'unselectable' => TRUE),
	array('description' => 'Align Left', 'plugin' => 'justifyLeft', 'class' => 'dijitEditorIconJustifyLeft'),
	array('description' => 'Align Center', 'plugin' => 'justifyCenter', 'class' => 'dijitEditorIconJustifyCenter'),
	array('description' => 'Align Right', 'plugin' => 'justifyRight', 'class' => 'dijitEditorIconJustifyRight'),
	array('description' => 'Justify', 'plugin' => 'justifyFull', 'class' => 'dijitEditorIconJustifyFull'),
	array('description' => 'Insert/Edit Link', 'plugin' => array('name' => 'dijit._editor.plugins.LinkDialog'), 'class' => 'dijitEditorIconCreateLink')
);

/**
 * Defines editor profiles specific menu items.
 */
function _dojo_editor_profiles_menu(&$items, $may_cache) {
}

/**
 * Loads all profiles or a specific profile.
 */
function _dojo_editor_profiles_load($profile_name = NULL) {
	static $profiles;

	if (isset($profiles)) {
		return $profile_name ? $profiles[$profile_name] : $profiles;
	}

	global $user;
	$results = db_query('SELECT P.name, P.weight, P.settings, R2.rid FROM {dojo_editor_profiles} P LEFT JOIN {dojo_editor_roles} R ON P.name = R.name AND R.rid IN (%s) LEFT JOIN {dojo_editor_roles} R2 ON P.name = R2.name ' . ($profile_name ? "WHERE P.name = '" . $profile_name . "'" : '') . ' ORDER BY P.weight', implode(',', array_keys($user->roles)));

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
 * The form used for creating and editing editor profiles.
 */
function _dojo_editor_profiles_list(&$form) {
	$form['editor_profiles'] = array(
		'#type' => 'fieldset',
		'#title' => t('Dojo Editor Profiles'),
		'#description' => t('<p>Editor profiles allow you associate editor settings to specific pages, fields and access roles.  Editor settings include which toolbar commands are visible and visibility options.</p><p><a href="!add_url">Add new editor profile</a></p>', array('!add_url' => url('admin/settings/dojo/editor/add')))
	);

	$profiles = _dojo_editor_profiles_load();
	if ($profiles) {
		$roles = user_roles();
		$header = array(t('Profile'), t('Show Toggle?'), t('Default State'), t('Roles'), t('Operations'));
		$rows = array();

		foreach ($profiles as $p) {
			$selected_roles = array();
			foreach ($p['rids'] as $rid) {
				$selected_roles[] = $roles[$rid];
			}

			$rows[] = array(
				array('data' => $p['name'], 'valign' => 'top'),
				array('data' => (!isset($p['show_toggle']) || $p['show_toggle'] == 1 ? 'yes' : 'no'), 'valign' => 'top'),
				array('data' => (!isset($p['default_state']) || $p['default_state'] == 1 ? 'enabled' : 'disabled'), 'valign' => 'top'),
				array('data' => implode("<br/>\n", $selected_roles), 'valign' => 'top'),
				array('data' => l(t('edit'), 'admin/settings/dojo/editor/edit/'. urlencode($p['name'])) . ' '. l(t('delete'), 'admin/settings/dojo/editor/delete/'. urlencode($p['name'])), 'valign' => 'top')
			);
		}

		$form['editor_profiles']['editor_profile_list'] = array(
			'#value' => theme('table', $header, $rows)
		);
	} else {
		global $dojo_toolbar_plugins;
		$default_toolbar = explode(',', DOJO_DEFAULT_EDITOR_TOOLBAR);
		$toolbar = array();
		for ($i = 0; $i < count($default_toolbar); $i++) {
			$toolbar[] = $dojo_toolbar_plugins[$default_toolbar[$i]]['description'];
		}

		$form['editor_profiles']['no_editor_profiles'] = array(
			'#value' => t('<div class="messages status"><p>No editor profiles found.</p><p>A default profile will be used for all access roles where the following settings are applied:<ul><li>Show enable/disable rich text editor link: <em>True</em></li><li>Default rich text editor state: <em>Disabled</em></li><li>Show on only the listed pages: $pages</li><li>Ignore textareas: $ignore</li><li>Toolbar: $toolbar</li></ul></p></div>', array('$pages' => str_replace("\n", ', ', DOJO_DEFAULT_EDITOR_PAGES), '$ignore' => str_replace("\n", ', ', DOJO_DEFAULT_EDITOR_IGNORE_TEXTAREAS), '$toolbar' => implode(', ', $toolbar)))
		);
	}
}

/**
 * Renders the config profiles form.
 */
function _dojo_editor_profiles_form(&$form, $action = 'add', $profile_name = NULL) {
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
				db_query("DELETE FROM {dojo_editor_profiles} WHERE name = '%s' or name = '%s'", $profile['name'], $profile['previous_name']);
				db_query("DELETE FROM {dojo_editor_roles} WHERE name = '%s' or name = '%s'", $profile['name'], $profile['previous_name']);

				// capture some values before we nuke unneeded variables
				$updating = isset($profile['op']) && $profile['op'] == t('Update profile');
				$rids = $profile['rids'];
				unset($profile['submit'], $profile['form_id'], $profile['op'], $profile['form_token'], $profile['previous_name'], $profile['rids']);

				db_query("INSERT INTO {dojo_editor_profiles} (name, weight, settings) VALUES ('%s', %s, '%s')", $profile['name'], $profile['weight'], serialize($profile));
				foreach ($rids as $rid => $value) {
					db_query("INSERT INTO {dojo_editor_roles} (name, rid) VALUES ('%s', %d)", $profile['name'], $rid);
				}

				drupal_set_message(t('The editor profile has been successfully ' . ($updating ? 'updated.' : 'created.')));
				drupal_goto('admin/settings/dojo');
				break;
			}

		case 'add':
		case 'edit':
			if ($action == 'edit' && $profile_name) {
				$profile = _dojo_editor_profiles_load($profile_name);
				_dojo_profiles_set_breadcrumbs('admin/settings/dojo/editor/edit', 'Update Dojo Editor Profile');
			} else {
				_dojo_profiles_set_breadcrumbs('admin/settings/dojo/editor/add', 'Add Dojo Editor Profile');
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
				'#value' => t('<p>Editor profiles allow you associate editor settings to a specific user role.  Editor settings include which toolbar commands are visible and visibility options.</p>')
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

			$form['general']['show_toggle'] = array(
				'#type' => 'radios',
				'#title' => t('Show enable/disable rich text editor link'),
				'#default_value' => isset($profile['show_toggle']) ? $profile['show_toggle'] : 1,
				'#options' => array(t('Disabled'), t('Enabled')),
				'#description' => t('The editor link is directly under each resizable textarea.'),
			);

			$form['general']['default_state'] = array(
				'#type' => 'radios',
				'#title' => t('Default rich text editor state'),
				'#default_value' => isset($profile['default_state']) ? $profile['default_state'] : 0,
				'#options' => array(t('Disabled'), t('Enabled')),
				'#description' => t('You may want certain pages or access roles to have the editor automatically loaded.'),
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

			$form['vis_settings'] = array(
				'#type' => 'fieldset',
				'#title' => t('Visibility'),
				'#description' => t('You can define the pages and fields in which the editor should appear.'),
				'#collapsible' => TRUE
			);

			$options = array(
				t('Show on every page except the listed pages.'),
				t('Show on only the listed pages.'),
				t('Show if the following PHP code returns <code>TRUE</code> (PHP-mode, experts only).')
			);
			$description = t("Enter one page per line as Drupal paths. The '*' character is a wildcard. Example paths are %blog for the blog page and %blog-wildcard for every personal blog. %front is the front page. If the PHP-mode is chosen, enter PHP code between %php. Note that executing incorrect PHP-code can break your Drupal site.", array('%blog' => 'blog', '%blog-wildcard' => 'blog/*', '%front' => '<front>', '%php' => '<?php ?>'));

			$form['vis_settings']['visibility'] = array(
				'#type' => 'radios',
				'#title' => t('Show editor on specific pages'),
				'#options' => $options,
				'#default_value' => isset($profile['visibility']) ? $profile['visibility'] : 1
			);
	
			$form['vis_settings']['pages'] = array(
				'#type' => 'textarea',
				'#title' => t('Pages'),
				'#default_value' => isset($profile['pages']) ? $profile['pages'] : DOJO_DEFAULT_EDITOR_PAGES,
				'#description' => $description
			);
	
			$form['vis_settings']['ignore_textareas'] = array(
				'#type' => 'textarea',
				'#title' => t('Ignore Textareas'),
				'#default_value' => isset($profile['ignore_textareas']) ? $profile['ignore_textareas'] : DOJO_DEFAULT_EDITOR_IGNORE_TEXTAREAS,
				'#description' => t('Enter one textarea name per line.')
			);

			$form['toolbar_cmds'] = array(
				'#type' => 'fieldset',
				'#title' => t('Toolbar'),
				'#description' => t('Select the toolbar buttons to be visible.  You may choose to restrict certain functions for users with restricted access.'),
				'#collapsible' => TRUE
			);

			$form['toolbar_cmds']['toolbar'] = array(
				'#type' => 'hidden',
				'#toolbar' => TRUE,
				'#selected_toolbar_buttons' => isset($profile['toolbar']) ? $profile['toolbar'] : DOJO_DEFAULT_EDITOR_TOOLBAR
			);

			$form['buttons']['submit'] = array(
				'#type' => 'submit',
				'#value' => t($saveButton)
			);
			break;

		case 'delete':
			db_query("DELETE FROM {dojo_editor_profiles} WHERE name = '%s'", $profile_name);
			db_query("DELETE FROM {dojo_editor_roles} WHERE name = '%s'", $profile_name);
			drupal_set_message('The editor profile has been successfully deleted.');
			drupal_goto('admin/settings/dojo');
			break;
	}
}

/**
 * Loads the editor profile based on the current user's access.
 */
function _dojo_editor_profiles_detect() {
	static $profile = NULL;

	if (!$profile) {
		global $user;

		// TODO: All editor profiles this user has access to should be cached and then queried based on rid!!!
		$results = db_query('SELECT P.name, P.settings FROM {dojo_editor_profiles} P JOIN {dojo_editor_roles} R ON P.name = R.name AND R.rid IN (%s) GROUP BY P.name, P.settings ORDER BY P.weight, P.name LIMIT 1', implode(',', array_keys($user->roles)));

		if ($data = db_fetch_object($results)) {
			$profile = unserialize($data->settings);
		}
	}

	return $profile;
}
