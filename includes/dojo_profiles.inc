<?php
// $Id:

/**
 * @file
 * Dojo profiles page and related functions.
 */

require_once('dojo_config_profiles.inc');
require_once('dojo_editor_profiles.inc');

/**
 * Defines config profiles specific menu items.
 */
function _dojo_profiles_menu(&$items, $may_cache) {
	if ($may_cache) {
		$items[] = array(
			'path' => 'admin/settings/dojo/profiles',
			'title' => t('Profiles'),
			'callback' => 'drupal_get_form',
			'callback arguments' => array('_dojo_profiles_form'),
			'type' => MENU_DEFAULT_LOCAL_TASK,
			'access' => user_access('administer Dojo')
		);
	}
	_dojo_config_profiles_menu($items, $may_cache);
	_dojo_editor_profiles_menu($items, $may_cache);
}

/**
 * Helper function to add Javascript files
 */
function _dojo_profiles_form($type = NULL, $action = NULL) {
	$form = array();

	$profile_name = '';
	for ($i = 5; arg($i) != NULL; $i++) {
		$profile_name .= ($i > 5 ? '/' : '') . urldecode(arg($i));
	}

	switch ($type) {
		case 'config':
			_dojo_config_profiles_form($form, $action, $profile_name);
			break;
		case 'editor':
			_dojo_editor_profiles_form($form, $action, $profile_name);
			break;
		default:
			_dojo_config_profiles_list($form);
			_dojo_editor_profiles_list($form);
	}

	return $form;
}

/**
 * Constructs the breadcrumbs when showing the profile forms.
 */
function _dojo_profiles_set_breadcrumbs($path, $title) {
	$breadcrumb[] = array('path' => 'admin', 'title' => t('administer'));
	$breadcrumb[] = array('path' => 'admin/settings/dojo', 'title' => t('Dojo Toolkit'));
	$breadcrumb[] = array('path' => $path, 'title' => t($title));
	menu_set_location($breadcrumb);
}
