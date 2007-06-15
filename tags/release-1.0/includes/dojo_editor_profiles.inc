<?php
// $Id:

/**
 * @file
 * Dojo editor profiles related functions.
 */

define('DOJO_DEFAULT_EDITOR_PAGES', "node*\nuser/*\ncomment/*\nadmin/build/block/*");
define('DOJO_DEFAULT_EDITOR_IGNORE_TEXTAREAS', "access_pages\ncaption\ndescription\nignore_textareas\nimg_assist_pages\nlog\npages\nsynonyms\nuser_mail_approval_body\nuser_mail_pass_body\nuser_mail_welcome_body");
define('DOJO_DEFAULT_EDITOR_TOOLBAR', '6,7,8,9,10,11,12,0,13,14,0,15,16,0,17,18,0,19,20,21,22,23');

// Array of all available toolbar buttons
global $dojo_toolbar_buttons;
$dojo_toolbar_buttons = array(
	array('description' => 'Separator', 'separator' => TRUE),
	array('description' => 'HTML Source', 'name' => 'htmltoggle', 'style' => 'background-image: none; width: 30px;', 'label' => '&lt;h&gt;'),
	array('description' => 'Copy', 'name' => 'copy', 'class' => 'dojoE2TBIcon_Copy'),
	array('description' => 'Paste', 'name' => 'paste', 'class' => 'dojoE2TBIcon_Paste'),
	array('description' => 'Undo', 'name' => 'undo', 'class' => 'dojoE2TBIcon_Undo'),
	array('description' => 'Redo', 'name' => 'redo', 'class' => 'dojoE2TBIcon_Redo'),
	array('description' => 'Insert/Edit Link', 'name' => 'createlink', 'class' => 'dojoE2TBIcon_Link'),
	array('description' => 'Insert/Edit Image', 'name' => 'insertimage', 'class' => 'dojoE2TBIcon_Image'),
	array('description' => 'Horizontal Rule', 'name' => 'inserthorizontalrule', 'class' => 'dojoE2TBIcon_HorizontalLine'),
	array('description' => 'Bold', 'name' => 'bold', 'class' => 'dojoE2TBIcon_Bold'),
	array('description' => 'Italic', 'name' => 'italic', 'class' => 'dojoE2TBIcon_Italic'),
	array('description' => 'Underline', 'name' => 'underline', 'class' => 'dojoE2TBIcon_Underline'),
	array('description' => 'Strikethrough', 'name' => 'strikethrough', 'class' => 'dojoE2TBIcon_StrikeThrough'),
	array('description' => 'Bullet List', 'name' => 'insertunorderedlist', 'class' => 'dojoE2TBIcon_BulletedList'),
	array('description' => 'Numbered List', 'name' => 'insertorderedlist', 'class' => 'dojoE2TBIcon_NumberedList'),
	array('description' => 'Indent', 'name' => 'indent', 'class' => 'dojoE2TBIcon_Indent', 'unselectable' => TRUE),
	array('description' => 'Outdent', 'name' => 'outdent', 'class' => 'dojoE2TBIcon_Outdent', 'unselectable' => TRUE),
	array('description' => 'Foreground Color', 'name' => 'forecolor', 'class' => 'dojoE2TBIcon_TextColor', 'unselectable' => TRUE),
	array('description' => 'Background Color', 'name' => 'hilitecolor', 'class' => 'dojoE2TBIcon_BackgroundColor', 'unselectable' => TRUE),
	array('description' => 'Align Left', 'name' => 'justifyleft', 'class' => 'dojoE2TBIcon_LeftJustify'),
	array('description' => 'Align Center', 'name' => 'justifycenter', 'class' => 'dojoE2TBIcon_CenterJustify'),
	array('description' => 'Align Right', 'name' => 'justifyright', 'class' => 'dojoE2TBIcon_RightJustify'),
	array('description' => 'Justify', 'name' => 'justifyfull', 'class' => 'dojoE2TBIcon_BlockJustify'),
	array('description' => 'Style', 'name' => 'plainformatblock', 'stylelist' => TRUE)
);

/**
 * Defines editor profiles specific menu items.
 */
function _dojo_editor_profiles_menu(&$items, $may_cache) {
	if ($may_cache) {
		$items[] = array(
			'path' => 'dojo/toolbar',
			'title' => t('Dojo Editor Toolbar Handler'),
			'callback' => '_dojo_editor_profiles_toolbar_handler',
			'type' => MENU_CALLBACK,
			'access' => TRUE
		);
	}
}

/**
 * Loads all profiles or a specific profile.
 */
function _dojo_editor_profiles_load($profile_name = NULL) {
	$results = db_query('SELECT P.name, P.weight, P.settings, R.rid FROM {dojo_editor_profiles} P JOIN {dojo_editor_roles} R ON P.name = R.name' . ($profile_name ? " WHERE P.name = '" . $profile_name . "'" : '') . ' ORDER BY P.weight');
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
		'#description' => t('<p>Editor profiles allow you associate editor settings to specific pages, fields and access roles.  Editor settings include which toolbar commands are visible and visibility options.</p><p><a href="/admin/settings/dojo/editor/add">Add new editor profile</a></p>')
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
		global $dojo_toolbar_buttons;
		$default_toolbar = explode(',', DOJO_DEFAULT_EDITOR_TOOLBAR);
		$toolbar = array();
		for ($i = 0; $i < count($default_toolbar); $i++) {
			$toolbar[] = $dojo_toolbar_buttons[$default_toolbar[$i]]['description'];
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

			$access = user_access('use PHP for block visibility');

			if ($profile['vis_settings'] == 2 && !$access) {
				$form['vis_settings'] = array();
				$form['vis_settings']['visibility'] = array('#type' => 'value', '#value' => 2);
				$form['vis_settings']['pages'] = array('#type' => 'value', '#value' => $profile['pages']);
			} else {
				$options = array(t('Show on every page except the listed pages.'), t('Show on only the listed pages.'));
				$description = t("Enter one page per line as Drupal paths. The '*' character is a wildcard. Example paths are %blog for the blog page and %blog-wildcard for every personal blog. %front is the front page.", array('%blog' => 'blog', '%blog-wildcard' => 'blog/*', '%front' => '<front>'));

				if ($access) {
					$options[] = t('Show if the following PHP code returns <code>TRUE</code> (PHP-mode, experts only).');
					$description .= ' ' . t('If the PHP-mode is chosen, enter PHP code between %php. Note that executing incorrect PHP-code can break your Drupal site.', array('%php' => '<?php ?>'));
				}

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
			}

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
 * Loads the editor profile based on the current user's access
 */
function _dojo_editor_profiles_detect() {
	static $profile = NULL;

	if (!$profile) {
		global $user;
		$results = db_query('SELECT P.name, P.settings FROM {dojo_editor_profiles} P JOIN {dojo_editor_roles} R ON P.name = R.name AND R.rid IN (%s) ORDER BY P.weight LIMIT 1', implode(',', array_keys($user->roles)));
		if ($data = db_fetch_object($results)) {
			$profile = unserialize($data->settings);
		}
	}

	return $profile;
}

/**
 * Builds the editor toolbar based on the profile name passed in or loads
 * the default toolbar.
 */
function _dojo_editor_profiles_toolbar_handler() {
	echo '<div class="EditorToolbarDomNode EditorToolbarSmallBg">';
	echo '<table cellpadding="1" cellspacing="0" border="0">';
	echo '<tbody>';
	echo '<tr valign="top" align="left">';
	echo "\n";

	$selected_buttons = explode(',', DOJO_DEFAULT_EDITOR_TOOLBAR);

	$profile = _dojo_editor_profiles_detect();
	if ($profile) {
		$selected_buttons = explode(',', $profile['toolbar']);
	}

	global $dojo_toolbar_buttons;
	for ($i = 0; $i < count($selected_buttons); $i++) {
		$button = $dojo_toolbar_buttons[$selected_buttons[$i]];

		if ($button['separator']) {
			echo '<td isSpacer="true">';
			echo '<span class="iconContainer">';
			echo '<span class="dojoE2TBIcon dojoE2TBIcon_Sep"	style="width: 5px; min-width: 5px;"></span>';
			echo '</span>';
			echo "</td>\n";
		} else if ($button['stylelist']) {
			echo '<td>';
			echo '<select class="dojoEditorToolbarItem" dojoETItemName="plainformatblock">';
			echo '<option value="">-- format --</option>';
			echo '<option value="p">Normal</option>';
			echo '<option value="pre">Fixed Font</option>';
			echo '<option value="h1">Main Heading</option>';
			echo '<option value="h2">Section Heading</option>';
			echo '<option value="h3">Sub-Heading</option>';
			echo '</select>';
			echo "</td>\n";
		} else {
			echo '<td>';
			echo '<span class="iconContainer dojoEditorToolbarItem" dojoETItemName="' . $button['name'] . '">';
			echo '<span class="dojoE2TBIcon' . (isset($button['class']) ? ' ' . $button['class'] : '') . '"';
			if (isset($button['unselectable']))
				echo ' unselectable="on"';
			if (isset($button['style']))
				echo ' style="' . $button['style'] . '"';
			echo '>' . (isset($button['label']) ? $button['label'] : '&nbsp;') . '</span>';
			echo '</span>';
			echo "</td>\n";
		}
	}

	echo '<td width="*">&nbsp;</td>';
	echo '</tr>';
	echo '</tbody>';
	echo '</table>';
	echo '</div>';
}
