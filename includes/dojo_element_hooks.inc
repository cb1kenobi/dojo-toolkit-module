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
		foreach (_dojo_config_profiles_load() as $config_profile_name => $config_profile) {
			if (!isset($config_profile['override_jquery']) || array_search('collapsiblepane', $config_profile['override_jquery']) === FALSE) {
				return $element;
			}
			break;
		}

		dojo_require_js('drupal.layout.CollapsiblePane');
		dojo_create_widget_js($element, 'drupal.layout.CollapsiblePane');

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
		dojo_require_js('drupal.form.SvnTree');
		dojo_create_widget_js($element, 'drupal.form.SvnTree', $element['#svnData']);
	} else if ($element['#toolbar']) {
		global $dojo_toolbar_buttons;
		dojo_require_js('drupal.form.CustomizeToolbar');
		dojo_create_widget_js($element, 'drupal.form.CustomizeToolbar', array('toolbarButtons' => $dojo_toolbar_buttons));
		$element['#value'] = $element['#selected_toolbar_buttons'];
	}
	return $element;
}

/**
 * Submit button callback function
 */
function _dojo_process_submit($element) {
	if ($element['#please_wait']) {
		$element['#id'] .= '_' + md5(mt_rand());
		dojo_require_js('drupal.PleaseWait');
		dojo_create_widget_js($element, 'drupal.PleaseWait');
	}
	return $element;
}

/**
 * Textarea callback function
 */
function _dojo_process_textarea($element) {
	if ($element['#googleMapKeyTable']) {
		dojo_require_js('drupal.form.GoogleMapKeyTable');
		dojo_create_widget_js($element, 'drupal.form.GoogleMapKeyTable');
		$element['#resizable'] = FALSE;
	/*
	} elseif ($element['#resizable'] !== FALSE) {
		foreach (_dojo_config_profiles_load() as $config_profile_name => $config_profile) {
			if (!isset($config_profile['override_jquery']) || array_search('editor', $config_profile['override_jquery']) === FALSE) {
				return $element;
			}
			break;
		}

		$editor_profiles = _dojo_editor_profiles_load();
		$element['#resizable'] = FALSE;

		// find just one profile that matches
		foreach ($editor_profiles as $editor_profile_name => $editor_profile) {
			if (_dojo_process_textarea_check_page($editor_profile) && _dojo_process_textarea_check_field($element, $editor_profile)) {
				$show_toggle = !isset($editor_profile['show_toggle']) || $editor_profile['show_toggle'] == 1;
				$default_state = isset($editor_profile['default_state']) && $editor_profile['default_state'] == 1;

				dojo_require_js('drupal.form.Editor');
				dojo_create_widget_js($element, 'drupal.form.Editor', array('showToggle' => $show_toggle, 'defaultState' => $default_state));

				$element['#resizable'] = FALSE;
				return $element;
			}
		}

		// if we didn't match a profile, then just create an editor for resizable purposes
		$show_toggle = _dojo_process_textarea_check_field($element);
		if (count($editor_profiles)) {
			$show_toggle = FALSE;
		}

		dojo_require_js('drupal.form.Editor');
		dojo_create_widget_js($element, 'drupal.form.Editor', array('showToggle' => $show_toggle, 'defaultState' => FALSE));
	*/
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

	$visibility = isset($profile['visibility']) ? $profile['visibility'] : 0;
	if ($visibility < 2) {
		$path = drupal_get_path_alias($_GET['q']);
		$regexp = '/^('. preg_replace(array('/(\r\n?|\n)/', '/\\\\\*/', '/(^|\|)\\\\<front\\\\>($|\|)/'), array('|', '.*', '\1'. preg_quote(variable_get('site_frontpage', 'node'), '/') .'\2'), preg_quote($pages, '/')) .')$/';
		$page_match = preg_match($regexp, $path);
		if (!$page_match && $path != $_GET['q']) {
			$page_match = preg_match($regexp, $_GET['q']);
		}
		return !($visibility xor $page_match);
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
	$id = substr($element['#id'], strpos($element['#id'], '-') + 1);
	return !preg_match($regexp, str_replace('-', '_', $id));
}

/**
 * Textfield callback function
 */
function _dojo_process_textfield($element) {
	if ($element['#autocomplete_path']) {
		foreach (_dojo_config_profiles_load() as $config_profile_name => $config_profile) {
			if (!isset($config_profile['override_jquery']) || array_search('autocomplete', $config_profile['override_jquery']) === FALSE) {
				return $element;
			}
			break;
		}

		dojo_require_js('drupal.form.AutoComplete');
		dojo_create_widget_js($element, 'drupal.form.AutoComplete', array('url' => check_url(url($element['#autocomplete_path']))));
		$element['#autocomplete_path'] = FALSE;
		$element['#attributes']['class'] .= ' form-autocomplete';
	}
	return $element;
}
