<?php
// $Id:

/**
 * @file
 * Callback functions for when elements are created.
 */

/**
 * Fieldset callback function
 */
function _dojo_process_fieldset($element) {
	if ($element['#collapsible']) {
		dojo_require_js('drupal.widget.CollapsiblePane');
		dojo_create_widget_js($element, 'drupal:CollapsiblePane');

		if (!isset($element['#attributes']['class'])) {
			$element['#attributes']['class'] = '';
		}
		$element['#attributes']['class'] .= ' collapsible';
		if ($element['#collapsed']) {
			$element['#attributes']['class'] .= ' collapsed';
		}
		$element['#collapsible'] = FALSE;
	}
	return $element;
}

/**
 * Hidden field callback function
 */
function _dojo_process_hidden($element) {
	if ($element['#svnTree']) {
		dojo_require_js('drupal.widget.SvnTree');
		dojo_create_widget_js($element, 'drupal:SvnTree', $element['#svnData']);
	} else if ($element['#toolbar']) {
		global $dojo_toolbar_buttons;
		dojo_require_js('drupal.widget.CustomizeToolbar');
		dojo_create_widget_js($element, 'drupal:CustomizeToolbar', array('toolbarButtons' => $dojo_toolbar_buttons));
		$element['#value'] = $element['#selected_toolbar_buttons'];
	}
	return $element;
}

/**
 * Submit button callback function
 */
function _dojo_process_submit($element) {
	if ($element['#pleaseWait']) {
		$element['#id'] .= '_' + md5(mt_rand());
		dojo_require_js('drupal.widget.PleaseWait');
		dojo_create_widget_js($element, 'drupal:PleaseWait');
	}
	return $element;
}

/**
 * Textarea callback function
 */
function _dojo_process_textarea($element) {
	static $profiles;

	if ($element['#googleMapKeyTable']) {
		dojo_require_js('drupal.widget.GoogleMapKeyTable');
		dojo_create_widget_js($element, 'drupal:GoogleMapKeyTable');
		$element['#resizable'] = FALSE;
	} elseif ($element['#resizable'] !== FALSE) {
		if (!$profiles) {
			$profiles = _dojo_editor_profiles_load();
		}
		$element['#resizable'] = FALSE;

		// find just one profile that matches
		foreach ($profiles as $profile_name => $profile) {
			if (_dojo_process_textarea_check_page($profile) && _dojo_process_textarea_check_field($element, $profile)) {
				dojo_require_js('drupal.widget.Editor');
				dojo_create_widget_js($element, 'drupal:Editor', array('profile' => $profile_name, 'revision' => (isset($profile['revision']) ? $profile['revision'] : '0'), 'showToggle' => (!isset($profile['show_toggle']) || $profile['show_toggle'] == 1), 'defaultState' => (!isset($profile['default_state']) || $profile['default_state'] == 1)));
				return $element;
			}
		}

		// if we didn't match a profile, then just create an editor for resizable purposes
		$allow_editor = _dojo_process_textarea_check_page() && _dojo_process_textarea_check_field($element);
		dojo_require_js('drupal.widget.Editor');
		dojo_create_widget_js($element, 'drupal:Editor', array('showToggle' => $allow_editor));
	}

	return $element;
}

/**
 * Helper function to check if this profile is applicable to this page
 */
function _dojo_process_textarea_check_page($profile = NULL) {
	$pages = isset($profile['pages']) ? $profile['pages'] : DOJO_DEFAULT_EDITOR_PAGES;
	if (!strlen($pages)) {
		return TRUE;
	}
	$access = isset($profile['access']) ? $profile['access'] : 1;
	if ($access < 2) {
		$path = drupal_get_path_alias($_GET['q']);
		$regexp = '/^('. preg_replace(array('/(\r\n?|\n)/', '/\\\\\*/', '/(^|\|)\\\\<front\\\\>($|\|)/'), array('|', '.*', '\1'. preg_quote(variable_get('site_frontpage', 'node'), '/') .'\2'), preg_quote($pages, '/')) .')$/';
		return !($access xor preg_match($regexp, $path));
	}
	return drupal_eval($pages);
}

/**
 * Helper function to check if this profile is applicable to this textarea
 */
function _dojo_process_textarea_check_field($element, $profile = NULL) {
	$ignore_textareas = isset($profile['ignore_textareas']) ? $profile['ignore_textareas'] : DOJO_DEFAULT_EDITOR_IGNORE_TEXTAREAS;
	if (!strlen($ignore_textareas)) {
		return TRUE;
	}
	$regexp = '/^('. preg_replace(array('/(\r\n?|\n)/'), array('|'), preg_quote($ignore_textareas, '/')) .')$/';
	return !preg_match($regexp, substr($element['#id'], strpos($element['#id'], '-') + 1));
}

/**
 * Textfield callback function
 */
function _dojo_process_textfield($element) {
	if ($element['#autocomplete_path']) {
		dojo_require_js('drupal.widget.AutoComplete');
		dojo_create_widget_js($element, 'drupal:AutoComplete', array('url' => check_url(url($element['#autocomplete_path']))));
		$element['#autocomplete_path'] = FALSE;
		$element['#attributes']['class'] .= ' form-autocomplete';
	}
	return $element;
}
